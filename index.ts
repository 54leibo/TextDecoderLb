class TextDecoderLb {
  decode(uint8Array: Uint8Array) {
    let str = ""; // 初始化一个空字符串用于存储解码后的结果
    let i = 0; // 初始化一个索引 i 用于迭代处理 Uint8Array 中的每一个字节

    while (i < uint8Array.length) {
      // 使用 while 循环逐个处理 Uint8Array 中的每一个字节
      let byte1 = uint8Array[i++]; // 读取下一个字节并将索引 i 自增，byte1 存储当前字节的值
      if (byte1 < 0x80) {
        // 如果字节值小于 0x80（即十进制的128）
        str += String.fromCharCode(byte1); // 将该字节转换为 Unicode 字符并追加到结果字符串中
      } else if (byte1 >= 0xc0 && byte1 < 0xe0) {
        // 如果字节值在 0xc0 和 0xe0 之间
        let byte2 = uint8Array[i++]; // 读取下一个字节，byte2 存储第二个字节的值
        str += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f)); // 按照 UTF-8 编码规则将两个字节转换为 Unicode 字符并追加到结果字符串中
      } else if (byte1 >= 0xe0 && byte1 < 0xf0) {
        // 如果字节值在 0xe0 和 0xf0 之间
        let byte2 = uint8Array[i++]; // 读取下一个字节，byte2 存储第二个字节的值
        let byte3 = uint8Array[i++]; // 读取下一个字节，byte3 存储第三个字节的值
        str += String.fromCharCode(
          ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
        ); // 按照 UTF-8 编码规则将三个字节转换为 Unicode 字符并追加到结果字符串中
      } else {
        // 对于大于 0xf0 的字节
        let byte2 = uint8Array[i++]; // 读取下一个字节，byte2 存储第二个字节的值
        let byte3 = uint8Array[i++]; // 读取下一个字节，byte3 存储第三个字节的值
        let byte4 = uint8Array[i++]; // 读取下一个字节，byte4 存储第四个字节的值
        // 将四个字节按照 UTF-8 编码规则转换为 Unicode 字符，并追加到结果字符串中
        let codePoint =
          ((byte1 & 0x07) << 18) |
          ((byte2 & 0x3f) << 12) |
          ((byte3 & 0x3f) << 6) |
          (byte4 & 0x3f);
        codePoint -= 0x10000;
        str += String.fromCharCode(
          0xd800 + (codePoint >> 10),
          0xdc00 + (codePoint & 0x3ff)
        );
      }
    }

    return str; // 返回解码后的结果字符串
  }
}

export default TextDecoderLb;
