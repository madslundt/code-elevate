import { IState } from "../types/IState";

export const replaceHandlebars = <T>(state: IState, template: T): T => {
  if (template === null || template === undefined) {
    return template;
  }

  if (Array.isArray(template)) {
    return template.map((item) => replaceHandlebars(state, item)) as T;
  }

  if (typeof template === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = replaceHandlebars(state, value);
    }

    return result as T;
  }

  if (typeof template === 'string') {
    return template.replace(/{(\w+)}/g, (match, key) =>
      (key && state[key]) ? state[key].toString() : match) as T;
  }

  return template;
};
