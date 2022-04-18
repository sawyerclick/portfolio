import { p as projects } from "../../../../chunks/projects-3b51f19c.js";
import "slugify";
const get = async ({ params }) => {
  const { projectType } = params;
  const body = projects.filter(({ type }) => type === projectType);
  return { body };
};
export { get };
