import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export type Captured = { base64: string; mediaType: string; uri: string };

/**
 * Takes or picks a photo and returns it downsized for analysis. A phone photo
 * is several megabytes; 1280px is ample for recognising food, keeps the upload
 * under the server's limit and makes each analysis faster and cheaper.
 * Resolves to null if the user cancels; throws if permission is refused.
 */
export async function capture(from: 'camera' | 'library'): Promise<Captured | null> {
  if (from === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('Camera access was not allowed');
  }
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8 };
  const res = from === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
  if (res.canceled || !res.assets?.length) return null;
  const asset = res.assets[0];
  const width = Math.min(asset.width || 1280, 1280);
  const out = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width } }], {
    compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true,
  });
  if (!out.base64) throw new Error('Could not read that photo');
  return { base64: out.base64, mediaType: 'image/jpeg', uri: out.uri };
}
