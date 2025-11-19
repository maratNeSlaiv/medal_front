import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";

// Создаём FormData из выбранных файлов
export function formDataFromImagePicker(result: ImagePicker.ImagePickerSuccessResult) {
  const formData = new FormData();

  result.assets.forEach((asset, index) => {
    // Используем только file или uri
    formData.append(
      `photo.${index}`,
      asset.file ?? new File(asset.uri)
    );

    if (asset.exif) {
      formData.append(`exif.${index}`, JSON.stringify(asset.exif));
    }
  });

  return formData;
}

// Функция выбора изображений и отправки на сервер
export async function pickImages() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    const response = await fetch("/api/img", {
      method: "POST",
      body: formDataFromImagePicker(result),
      headers: { Accept: "application/json" },
    });
    return { serverResponse: await response.json(), assets: result.assets };
  }

  return null;
}
