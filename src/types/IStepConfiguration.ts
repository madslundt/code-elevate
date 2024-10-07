import { IStep } from "./IStep";
export interface IStepConfiguration {
  name: string;
  description?: string;
  fileExtensions?: string[];
  steps: IStep[];
}
