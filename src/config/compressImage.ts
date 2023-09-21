import sharp from "sharp";
import path from "path";

export const compressImage = async (
  inputPath: string,
  outputPath: string,
  targetWidth: number,
  targetHeight: number
): Promise<void> => {
  try {
    const format = path.extname(inputPath).slice(1);

    const image = sharp(inputPath);

    // 이미지의 메타데이터 가져오기
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Failed to get image metadata");
    }
    const originalRatio = metadata.width / metadata.height;

    // 목표 비율 설정
    const targetRatio = 4 / 3;

    // 이미지 리사이징
    let resizeWidth, resizeHeight;

    if (originalRatio > targetRatio) {
      resizeWidth = Math.round(metadata.height * targetRatio);
      resizeHeight = metadata.height;
    } else {
      resizeWidth = metadata.width;
      resizeHeight = Math.round(metadata.width / targetRatio);
    }

    await image
      .resize(resizeWidth, resizeHeight, {
        fit: "cover",
      })
      .extract({
        width: Math.min(targetWidth, resizeWidth),
        height: Math.min(targetHeight, resizeHeight),
        left: 0,
        top: 0,
      })
      .toFile(outputPath);

    switch (format) {
      case "jpeg":
        await sharp(outputPath).jpeg({ quality: 80 }).toFile(outputPath);
        break;
      case "jpg":
        await sharp(outputPath).jpeg({ quality: 80 }).toFile(outputPath);
        break;
      case "png":
        await sharp(outputPath).png({ quality: 80 }).toFile(outputPath);
        break;
      default:
        console.log(`Unsupported image format: ${format}`);
    }
  } catch (error) {
    console.error("Error compressing image", error);
  }
};
