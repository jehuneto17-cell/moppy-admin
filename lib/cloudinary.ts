import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tudo do Moppy fica dentro dessa pasta raiz — nunca mexe nas outras pastas
// que já existem na conta (emporio-minas, nova-era-tintas, sara-pastelaria).
const ROOT_FOLDER = "Moppy";

export async function uploadMedia(dataUri: string, folder: string, sensitive: boolean) {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `${ROOT_FOLDER}/${folder}`,
    type: sensitive ? "authenticated" : "upload",
    resource_type: "image",
  });

  return {
    publicId: result.public_id,
    folder: result.folder,
    type: result.type,
    url: sensitive ? signedUrl(result.public_id) : result.secure_url,
  };
}

// Documentos sensíveis (KYC) usam type "authenticated" — a URL de upload não
// abre direto, precisa assinar toda vez que for exibir (ex: tela de aprovação).
export function signedUrl(publicId: string) {
  return cloudinary.url(publicId, { type: "authenticated", sign_url: true, secure: true });
}
