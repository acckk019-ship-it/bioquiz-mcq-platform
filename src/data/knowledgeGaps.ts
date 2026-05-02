import { GapsData } from '../types';

export const knowledgeGapsData: GapsData = {
  "Cell Structures/Organelles": [
    {
      "question_en": "Which organelle is primarily responsible for generating ATP through cellular respiration?",
      "question_ar": "أي عضو خلوي مسؤول بشكل أساسي عن توليد ATP من خلال التنفس الخلوي؟",
      "options_en": ["Endoplasmic Reticulum", "Golgi Apparatus", "Mitochondrion", "Lysosome"],
      "options_ar": ["الشبكة الإندوبلازمية", "جهاز جولجي", "الميتوكوندريا", "الليزوزوم"],
      "correctIndex": 2,
      "userAnsIndex": null,
      "explanation": {
        "en": "The mitochondrion is the powerhouse of the cell, responsible for generating ATP (adenosine triphosphate) through the process of cellular respiration.",
        "ar": "الميتوكوندريا هي مركز الطاقة في الخلية، وهي مسؤولة عن توليد ATP (أدينوسين ثلاثي الفوسفات) من خلال عملية التنفس الخلوي."
      },
      "keyWords": [{ "en": "Mitochondrion", "ar": "ميتوكوندريا" }, { "en": "ATP", "ar": "أدينوسين ثلاثي الفوسفات" }]
    }
  ],
  "Photosynthesis": [
    {
      "question_en": "What is the main purpose of the Calvin cycle in photosynthesis?",
      "question_ar": "ما هو الغرض الرئيسي من دورة كالفن في عملية التمثيل الضوئي؟",
      "options_en": ["To capture light energy", "To split water molecules", "To fix carbon dioxide into sugar", "To release oxygen"],
      "options_ar": ["لالتقاط طاقة الضوء", "لتقسيم جزيئات الماء", "لتثبيت ثاني أكسيد الكربون في السكر", "لإطلاق الأكسجين"],
      "correctIndex": 2,
      "userAnsIndex": null,
      "explanation": {
        "en": "The Calvin cycle is a series of biochemical reactions that occur in the stroma of chloroplasts during photosynthesis. Its primary purpose is to fix carbon dioxide (CO2) from the atmosphere and convert it into glucose (sugar).",
        "ar": "دورة كالفن هي سلسلة من التفاعلات الكيميائية الحيوية التي تحدث في ستروما البلاستيدات الخضراء أثناء عملية التمثيل الضوئي. هدفها الأساسي هو تثبيت ثاني أكسيد الكربون (CO2) من الغلاف الجوي وتحويله إلى جلوكوز (سكر)."
      },
      "keyWords": [{ "en": "Calvin cycle", "ar": "دورة كالفن" }, { "en": "Photosynthesis", "ar": "التمثيل الضوئي" }]
    }
  ],
  "Transition Elements": [
    {
      "question_en": "Why are transition elements characterized by high melting and boiling points?",
      "question_ar": "لماذا تتميز العناصر الانتقالية بدرجات انصهار وغليان عالية؟",
      "options_en": ["Due to weak ionic bonds", "Due to strong metallic bonding involving both s and d electrons", "Because they have low density", "Because they are non-metals"],
      "options_ar": ["بسبب الروابط الأيونية الضعيفة", "بسبب الرابطة الفلزية القوية التي تشمل كل من إلكترونات s و d", "لأن لديهم كثافة منخفضة", "لأنهم غير فلزات"],
      "correctIndex": 1,
      "userAnsIndex": null,
      "explanation": {
        "en": "Transition elements have high melting and boiling points because of strong metallic bonding, which results from the participation of both 4s and 3d electrons in the bond formation.",
        "ar": "تتميز العناصر الانتقالية بدرجات انصهار وغليان عالية بسبب الرابطة الفلزية القوية، والتي تنتج عن مشاركة كل من إلكترونات 4s و 3d في تكوين الرابطة."
      },
      "keyWords": [{ "en": "Metallic bonding", "ar": "رابطة فلزية" }, { "en": "Transition elements", "ar": "عناصر انتقالية" }]
    }
  ],
  "Chemical Equilibrium": [
    {
      "question_en": "How does a catalyst affect the position of chemical equilibrium?",
      "question_ar": "كيف يؤثر العامل الحفاز على موضع الاتزان الكيميائي؟",
      "options_en": ["Shifts it to the right", "Shifts it to the left", "Does not affect the position", "Increases the equilibrium constant"],
      "options_ar": ["يزيحه إلى اليمين", "يزيحه إلى اليسار", "لا يؤثر على الموضع", "يزيد من ثابت الاتزان"],
      "correctIndex": 2,
      "userAnsIndex": null,
      "explanation": {
        "en": "A catalyst increases the rate of both forward and backward reactions equally, so it helps reach equilibrium faster but does not change the position of equilibrium or the value of the equilibrium constant.",
        "ar": "يزيد العامل الحفاز من معدل التفاعلين الأمامي والخلفي بالتساوي، لذا فهو يساعد في الوصول إلى الاتزان بشكل أسرع ولكنه لا يغير موضع الاتزان أو قيمة ثابت الاتزان."
      },
      "keyWords": [{ "en": "Catalyst", "ar": "عامل حفاز" }, { "en": "Equilibrium", "ar": "اتزان" }]
    }
  ]
};
