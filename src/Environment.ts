import StringDictReaderReadOnly from "./StringDictionaryReader/ReadOnly";

const Environment = new StringDictReaderReadOnly(process.env as Record<string, string>);

export default Environment;
