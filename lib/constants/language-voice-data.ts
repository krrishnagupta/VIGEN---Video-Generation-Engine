export const LANGUAGES = [
  { language: "English (United States)", countryCode: "US", countryFlag: "/flags/us.png", modelName: "deepgram", modelLangCode: "en-US" },
  { language: "English (United Kingdom)", countryCode: "GB", countryFlag: "/flags/gb.png", modelName: "deepgram", modelLangCode: "en-GB" },
  { language: "Spanish (Mexico)", countryCode: "MX", countryFlag: "/flags/mx.png", modelName: "deepgram", modelLangCode: "es-MX" },
  { language: "Spanish (Spain)", countryCode: "ES", countryFlag: "/flags/es.png", modelName: "deepgram", modelLangCode: "es-ES" },
  { language: "French", countryCode: "FR", countryFlag: "/flags/fr.png", modelName: "deepgram", modelLangCode: "fr-FR" },
  { language: "German", countryCode: "DE", countryFlag: "/flags/de.png", modelName: "deepgram", modelLangCode: "de-DE" },
  { language: "Italian", countryCode: "IT", countryFlag: "/flags/it.png", modelName: "deepgram", modelLangCode: "it-IT" },
  { language: "Portuguese (Brazil)", countryCode: "BR", countryFlag: "/flags/br.png", modelName: "deepgram", modelLangCode: "pt-BR" },
  { language: "Portuguese (Portugal)", countryCode: "PT", countryFlag: "/flags/pt.png", modelName: "deepgram", modelLangCode: "pt-PT" },
  { language: "Dutch", countryCode: "NL", countryFlag: "/flags/nl.png", modelName: "deepgram", modelLangCode: "nl-NL" },
  { language: "Russian", countryCode: "RU", countryFlag: "/flags/ru.png", modelName: "deepgram", modelLangCode: "ru-RU" },
  { language: "Turkish", countryCode: "TR", countryFlag: "/flags/tr.png", modelName: "deepgram", modelLangCode: "tr-TR" },
  { language: "Arabic (Modern Standard)", countryCode: "SA", countryFlag: "/flags/sa.png", modelName: "deepgram", modelLangCode: "ar-SA" },
  { language: "Mandarin (Simplified)", countryCode: "CN", countryFlag: "/flags/cn.png", modelName: "deepgram", modelLangCode: "zh-CN" },
  { language: "Japanese", countryCode: "JP", countryFlag: "/flags/jp.png", modelName: "deepgram", modelLangCode: "ja-JP" },
  { language: "Korean", countryCode: "KR", countryFlag: "/flags/kr.png", modelName: "deepgram", modelLangCode: "ko-KR" },
  { language: "Vietnamese", countryCode: "VN", countryFlag: "/flags/vn.png", modelName: "deepgram", modelLangCode: "vi-VN" },
  { language: "Indonesian", countryCode: "ID", countryFlag: "/flags/id.png", modelName: "deepgram", modelLangCode: "id-ID" },
  { language: "Hindi", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "hi-IN" },
  { language: "Marathi", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "mr-IN" },
  { language: "Telugu", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "te-IN" },
  { language: "Tamil", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "ta-IN" },
  { language: "Kannada", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "kn-IN" },
  { language: "Bengali", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "bn-IN" },
  { language: "Malayalam", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "ml-IN" },
  { language: "Gujarati", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "gu-IN" },
  { language: "Punjabi", countryCode: "IN", countryFlag: "/flags/in.png", modelName: "fondalab", modelLangCode: "pa-IN" }
]

export const VOICES = [
  // Deepgram Voices (English US/UK)
  { id: "aura-2-odysseus-en", provider: "deepgram", modelName: "odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", lang: "en-US" },
  { id: "aura-2-thalia-en", provider: "deepgram", modelName: "thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", lang: "en-US" },
  { id: "aura-2-analthea-en", provider: "deepgram", modelName: "analthea", preview: "/voice/deepgram-aura-2-amalthea-en.wav", gender: "female", lang: "en-US" },
  { id: "aura-2-andromeda-en", provider: "deepgram", modelName: "andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", lang: "en-US" },
  { id: "aura-2-apollo-en", provider: "deepgram", modelName: "apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", lang: "en-US" },
  { id: "aura-2-arcas-en", provider: "deepgram", modelName: "arcas", preview: "/voice/deepgram-aura-2-arcas-en.wav", gender: "male", lang: "en-US" },

  { id: "aura-2-odysseus-en-gb", provider: "deepgram", modelName: "odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", lang: "en-GB" },
  
  // Western Languages (Using English placeholders)
  { id: "aura-2-thalia-es-mx", provider: "deepgram", modelName: "thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", lang: "es-MX" },
  { id: "aura-2-apollo-es-es", provider: "deepgram", modelName: "apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", lang: "es-ES" },
  { id: "aura-2-analthea-fr", provider: "deepgram", modelName: "analthea", preview: "/voice/deepgram-aura-2-amalthea-en.wav", gender: "female", lang: "fr-FR" },
  { id: "aura-2-arcas-de", provider: "deepgram", modelName: "arcas", preview: "/voice/deepgram-aura-2-arcas-en.wav", gender: "male", lang: "de-DE" },
  { id: "aura-2-andromeda-it", provider: "deepgram", modelName: "andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", lang: "it-IT" },
  { id: "aura-2-thalia-pt-br", provider: "deepgram", modelName: "thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", lang: "pt-BR" },
  { id: "aura-2-odysseus-pt-pt", provider: "deepgram", modelName: "odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", lang: "pt-PT" },
  { id: "aura-2-analthea-nl", provider: "deepgram", modelName: "analthea", preview: "/voice/deepgram-aura-2-amalthea-en.wav", gender: "female", lang: "nl-NL" },
  { id: "aura-2-apollo-ru", provider: "deepgram", modelName: "apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", lang: "ru-RU" },
  { id: "aura-2-arcas-tr", provider: "deepgram", modelName: "arcas", preview: "/voice/deepgram-aura-2-arcas-en.wav", gender: "male", lang: "tr-TR" },
  { id: "aura-2-andromeda-ar", provider: "deepgram", modelName: "andromeda", preview: "/voice/deepgram-aura-2-andromeda-en.wav", gender: "female", lang: "ar-SA" },
  { id: "aura-2-thalia-zh", provider: "deepgram", modelName: "thalia", preview: "/voice/deepgram-aura-2-thalia-en.wav", gender: "female", lang: "zh-CN" },
  { id: "aura-2-odysseus-ja", provider: "deepgram", modelName: "odysseus", preview: "/voice/deepgram-aura-2-odysseus-en.wav", gender: "male", lang: "ja-JP" },
  { id: "aura-2-analthea-ko", provider: "deepgram", modelName: "analthea", preview: "/voice/deepgram-aura-2-amalthea-en.wav", gender: "female", lang: "ko-KR" },
  { id: "aura-2-apollo-vi", provider: "deepgram", modelName: "apollo", preview: "/voice/deepgram-aura-2-apollo-en.wav", gender: "male", lang: "vi-VN" },
  { id: "aura-2-arcas-id", provider: "deepgram", modelName: "arcas", preview: "/voice/deepgram-aura-2-arcas-en.wav", gender: "male", lang: "id-ID" },
  
  // Fonadalab Voices (Indian Languages)
  // Hindi (4 Narrators requested)
  { id: "fonadalab-meghra-hi", provider: "fonadalab", modelName: "meghra", preview: "/voice/fonadalab-Meghra.mp3", gender: "female", lang: "hi-IN" },
  { id: "fonadalab-vaanee-hi", provider: "fonadalab", modelName: "vaanee", preview: "/voice/fonadalab-Vaanee.mp3", gender: "female", lang: "hi-IN" },
  { id: "fonadalab-chaitra-hi", provider: "fonadalab", modelName: "chaitra", preview: "/voice/fonadalab-Chaitra.mp3", gender: "female", lang: "hi-IN" },
  { id: "fonadalab-nirvani-hi", provider: "fonadalab", modelName: "nirvani", preview: "/voice/fonadalab-Nirvani.mp3", gender: "female", lang: "hi-IN" },

  // Other Indian Languages (At least 1 narrator)
  { id: "fonadalab-vaanee-mr", provider: "fonadalab", modelName: "vaanee", preview: "/voice/fonadalab-Vaanee.mp3", gender: "female", lang: "mr-IN" },
  { id: "fonadalab-chaitra-te", provider: "fonadalab", modelName: "chaitra", preview: "/voice/fonadalab-Chaitra.mp3", gender: "female", lang: "te-IN" },
  { id: "fonadalab-meghra-ta", provider: "fonadalab", modelName: "meghra", preview: "/voice/fonadalab-Meghra.mp3", gender: "female", lang: "ta-IN" },
  { id: "fonadalab-nirvani-kn", provider: "fonadalab", modelName: "nirvani", preview: "/voice/fonadalab-Nirvani.mp3", gender: "female", lang: "kn-IN" },
  { id: "fonadalab-vaanee-bn", provider: "fonadalab", modelName: "vaanee", preview: "/voice/fonadalab-Vaanee.mp3", gender: "female", lang: "bn-IN" },
  { id: "fonadalab-chaitra-ml", provider: "fonadalab", modelName: "chaitra", preview: "/voice/fonadalab-Chaitra.mp3", gender: "female", lang: "ml-IN" },
  { id: "fonadalab-meghra-gu", provider: "fonadalab", modelName: "meghra", preview: "/voice/fonadalab-Meghra.mp3", gender: "female", lang: "gu-IN" },
  { id: "fonadalab-nirvani-pa", provider: "fonadalab", modelName: "nirvani", preview: "/voice/fonadalab-Nirvani.mp3", gender: "female", lang: "pa-IN" }
]
