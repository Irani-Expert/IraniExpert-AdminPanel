export async function base64Maker(file) {
  let url = URL.createObjectURL(file);
  return url;
}
