import * as _ from 'lodash-es';
import * as TerraformPlanType from '../../common/terraformPlan';

const parseId = (resourceId: string): TerraformPlanType.ResourceId => {
  const idSegments = resourceId.split('.');
  const resourceName = idSegments[idSegments.length - 1];
  const resourceType = idSegments[idSegments.length - 2] || '';
  const resourcePrefixes = idSegments.slice(0, idSegments.length - 2);

  return { name: resourceName, type: resourceType, prefixes: resourcePrefixes };
};

const parseWarnings = (terraformPlan: string): TerraformPlanType.Warning[] => {
  const warningRegex = new RegExp('Warning: (.*:)(.*)', 'gm');
  let warning: RegExpExecArray;
  const warnings: TerraformPlanType.Warning[] = [];

  do {
    warning = warningRegex.exec(terraformPlan) as RegExpExecArray;
    if (warning) {
      warnings.push({ id: parseId(warning[1]), detail: warning[2] });
    }
  } while (warning);

  return warnings;
};
const extractChangeSummary = (terraformPlan: string) => {
  const beginActionRegex = new RegExp(
    'Terraform will perform the following actions:',
    'gm'
  );
  const begin = beginActionRegex.exec(terraformPlan);

  if (begin) return terraformPlan.substring(begin.index + 45);
  else return terraformPlan;
};

const extractIndividualChanges = (changeSummary: string) => {
  const changeRegex = new RegExp(
    '([~+-]|-/+|<=) [\\S\\s]*?((?=-/+|[~+-] |<=|Plan:)|$)',
    'g'
  );
  let change;
  const changes = [];

  do {
    change = changeRegex.exec(changeSummary);
    if (change) changes.push(change[0]);
  } while (change);

  return changes;
};

const parseChangeSymbol = (
  changeTypeSymbol: string
): TerraformPlanType.ChangeType => {
  if (changeTypeSymbol === '-') return TerraformPlanType.ChangeType.Destroy;
  else if (changeTypeSymbol === '+') return TerraformPlanType.ChangeType.Create;
  else if (changeTypeSymbol === '~') return TerraformPlanType.ChangeType.Update;
  else if (changeTypeSymbol === '<=') return TerraformPlanType.ChangeType.Read;
  else if (changeTypeSymbol === '-/+')
    return TerraformPlanType.ChangeType.Recreate;
  else return TerraformPlanType.ChangeType.Unknown;
};

const parseSingleValueDiffs = (change: string): TerraformPlanType.Diff[] => {
  const propertyAndValueRegex = new RegExp(
    '\\s*(.*?): *(?:<computed>|"(|[\\S\\s]*?[^\\\\])")',
    'gm'
  );
  let diff;
  const diffs = [];

  do {
    diff = propertyAndValueRegex.exec(change);
    if (diff) {
      diffs.push({
        property: diff[1].trim(),
        new: diff[2] !== undefined ? diff[2] : '<computed>',
      });
    }
  } while (diff);

  return diffs;
};
const parseNewAndOldValueDiffs = (change: string): TerraformPlanType.Diff[] => {
  const propertyAndNewAndOldValueRegex = new RegExp(
    '\\s*(.*?): *(?:"(|[\\S\\s]*?[^\\\\])")[\\S\\s]*?=> *(?:<computed>|"(|[\\S\\s]*?[^\\\\])")( \\(forces new resource\\))?',
    'gm'
  );
  let diff;
  const diffs = [];

  do {
    diff = propertyAndNewAndOldValueRegex.exec(change);
    if (diff) {
      diffs.push({
        property: diff[1].trim(),
        old: diff[2],
        new: diff[3] !== undefined ? diff[3] : '<computed>',
        forcesNewResource: diff[4] !== undefined,
      });
    }
  } while (diff);

  return diffs;
};

const parseChange = (change: string): TerraformPlanType.Action => {
  const changeTypeAndIdRegex = new RegExp('([~+-]|-/+|<=) (.*)$', 'gm');
  const changeTypeAndId = changeTypeAndIdRegex.exec(change) as string[];
  const changeTypeSymbol = changeTypeAndId[1];
  let resourceId = changeTypeAndId[2];

  let type;
  type = parseChangeSymbol(changeTypeSymbol);

  //Workaround for recreations showing up as '+' changes
  if (resourceId.match('(new resource required)')) {
    type = TerraformPlanType.ChangeType.Recreate;
    resourceId = resourceId.replace(' (new resource required)', '');
  }

  let diffs;
  if (
    type === TerraformPlanType.ChangeType.Create ||
    TerraformPlanType.ChangeType.Read
  ) {
    diffs = parseSingleValueDiffs(change);
  } else {
    diffs = parseNewAndOldValueDiffs(change);
  }

  return {
    id: parseId(resourceId),
    type,
    changes: diffs,
  };
};

const parse = (terraformPlan: string): TerraformPlanType.Plan => {
  const warnings: TerraformPlanType.Warning[] = parseWarnings(terraformPlan); //추후에

  const changeSummary = extractChangeSummary(terraformPlan);
  const changes = extractIndividualChanges(changeSummary);

  const plan = { warnings, actions: [] as TerraformPlanType.Action[] };
  for (let i = 0; i < changes.length; i++) {
    plan.actions.push(parseChange(changes[i]));
  }

  return plan;
};

export default parse;
