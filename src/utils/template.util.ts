export function parseTemplateContent(string, variables) {
  const parsedNameTag = string.replace(/{{(.*?)}}/g, (match, index) => {
    // Check if the index exists in the variables object
    if (variables.hasOwnProperty(index)) {
      return variables[index];
    }
    return match; // If no variable match, return the original placeholder
  });

  return parsedNameTag;
}
