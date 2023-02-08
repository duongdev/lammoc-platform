export const getFormData = async <Data = {}>(request: Request) => {
  return Object.fromEntries(await request.formData()) as Data
}
