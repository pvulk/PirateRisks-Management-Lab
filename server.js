const express = require("express");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

/*
 * =========================================
 * FICHIERS STATIQUES
 * =========================================
 */

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});


/*
 * =========================================
 * VALIDATION / NORMALISATION
 * =========================================
 */

function clampValue(value) {
  const number = Number(value);

  if (number <= 1) return 1;
  if (number >= 3) return 3;

  return 2;
}

function clampCorrectAnswer(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(
    3,
    Math.max(
      0,
      Math.round(number)
    )
  );
}


/*
 * =========================================
 * SCHÉMA D'UNE QUESTION
 * =========================================
 */

const questionSchema = {
  type: "object",
  additionalProperties: false,

  properties: {
    category: {
      type: "string"
    },

    scenario: {
      type: "string"
    },

    answers: {
      type: "array",

      items: {
        type: "string"
      }
    },

    correctAnswer: {
      type: "integer"
    },

    feedback: {
      type: "string"
    },

    risk: {
      type: "object",
      additionalProperties: false,

      properties: {
        asset: {
          type: "string"
        },

        threat: {
          type: "string"
        },

        vector: {
          type: "string"
        },

        vulnerability: {
          type: "string"
        },

        event: {
          type: "string"
        },

        impact: {
          type: "string"
        },

        initialProbability: {
          type: "integer"
        },

        initialImpact: {
          type: "integer"
        },

        reducedProbability: {
          type: "integer"
        },

        securityReflex: {
          type: "string"
        }
      },

      required: [
        "asset",
        "threat",
        "vector",
        "vulnerability",
        "event",
        "impact",
        "initialProbability",
        "initialImpact",
        "reducedProbability",
        "securityReflex"
      ]
    }
  },

  required: [
    "category",
    "scenario",
    "answers",
    "correctAnswer",
    "feedback",
    "risk"
  ]
};


/*
 * =========================================
 * SCHÉMA DU QUIZ COMPLET
 * =========================================
 *
 * On utilise 5 propriétés obligatoires
 * plutôt qu'un tableau dont la longueur
 * devrait être contrôlée.
 * =========================================
 */

const quizSchema = {
  type: "object",
  additionalProperties: false,

  properties: {
    question1: questionSchema,
    question2: questionSchema,
    question3: questionSchema,
    question4: questionSchema,
    question5: questionSchema
  },

  required: [
    "question1",
    "question2",
    "question3",
    "question4",
    "question5"
  ]
};


/*
 * =========================================
 * ROUTE IA
 * =========================================
 */

app.post(
  "/api/generate-scenario",
  async (req, res) => {

    try {

      const {
        job_role,
        industry,
        tools,
        cyber_level
      } = req.body;


      /*
       * Validation du profil
       */

      if (
        !job_role ||
        !industry ||
        !cyber_level ||
        !Array.isArray(tools) ||
        tools.length === 0
      ) {

        return res.status(400).json({
          error:
            "Profil utilisateur incomplet."
        });
      }


      /*
       * Nettoyage des outils
       */

      const cleanTools =
        tools
          .filter(
            tool =>
              typeof tool === "string"
          )
          .map(
            tool =>
              tool.trim()
          )
          .filter(Boolean);


      if (cleanTools.length === 0) {

        return res.status(400).json({
          error:
            "Aucun outil valide n'a été fourni."
        });
      }


      /*
       * =========================================
       * PROMPT
       * =========================================
       */

      const prompt = `
Tu es PirateRisks Lab, un moteur pédagogique de sensibilisation à la cybersécurité.

Ta mission est de générer exactement 5 situations cyber professionnelles personnalisées.

PROFIL UTILISATEUR
- Fonction : ${job_role}
- Secteur : ${industry}
- Outils utilisés : ${cleanTools.join(", ")}
- Niveau cyber : ${cyber_level}

OBJECTIF PÉDAGOGIQUE
Créer un mini-parcours de sensibilisation composé de 5 questions.

Chaque question doit placer l'utilisateur dans une situation réaliste
dans laquelle il doit prendre une décision.

DIVERSIFICATION
- Les 5 situations doivent être différentes.
- Lorsque plusieurs outils sont sélectionnés, utilise autant que possible plusieurs outils différents.
- Évite de générer cinq variantes de phishing.
- Varie les menaces, les vecteurs d'attaque et les contextes professionnels.
- Évite de répéter une même menace sauf si le contexte le justifie réellement.
- Adapte la difficulté au niveau cyber de l'utilisateur.
- Les situations doivent rester réalistes pour la fonction et le secteur indiqués.

MENACES POSSIBLES
Tu peux notamment utiliser :
- phishing
- spear phishing
- Business Email Compromise
- fraude au président
- vol d'identifiants
- MFA fatigue
- ingénierie sociale
- fuite de données
- usage risqué de l'IA générative
- faux partage de document
- usurpation d'identité
- compromission de compte
- exposition de données cloud
- logiciel malveillant
- pièce jointe malveillante
- faux portail d'authentification
- domaine usurpé

POUR CHAQUE QUESTION
- exactement 4 réponses possibles ;
- une seule réponse correcte ;
- les mauvaises réponses doivent être plausibles ;
- la bonne réponse ne doit pas toujours se trouver au même endroit ;
- correctAnswer doit correspondre à :
  0 = A
  1 = B
  2 = C
  3 = D
- le feedback doit expliquer pourquoi la bonne réponse réduit le risque ;
- le scénario doit rester défensif, professionnel et pédagogique.

ANALYSE DE RISQUE
Pour chaque question, identifie :
- asset : l'actif concerné ;
- threat : la menace ;
- vector : le vecteur d'attaque ;
- vulnerability : la vulnérabilité humaine ou organisationnelle ;
- event : l'événement redouté ;
- impact : l'impact potentiel ;
- initialProbability : la probabilité initiale ;
- initialImpact : l'impact initial ;
- reducedProbability : la probabilité après adoption du bon comportement ;
- securityReflex : le réflexe de sécurité à retenir.

SCORING
Pour :
- initialProbability
- initialImpact
- reducedProbability

utilise uniquement :
1 = faible
2 = moyen
3 = élevé

La probabilité résiduelle doit être inférieure ou égale
à la probabilité initiale.

IMPORTANT
Tu dois remplir exactement :
question1,
question2,
question3,
question4,
question5.

Ne retourne rien d'autre que les données structurées demandées.
`;


      /*
       * =========================================
       * APPEL OPENAI
       * =========================================
       */

      const response =
        await client.responses.create({

          model: "gpt-5.6",

          input: prompt,

          text: {
            format: {
              type: "json_schema",
              name: "piraterisks_quiz",
              strict: true,
              schema: quizSchema
            }
          }

        });


      /*
       * =========================================
       * PARSING
       * =========================================
       */

      const rawText =
        response.output_text;

      const quiz =
        JSON.parse(
          rawText
        );


      /*
       * =========================================
       * TRANSFORMATION EN TABLEAU
       * =========================================
       */

      const questions = [
        quiz.question1,
        quiz.question2,
        quiz.question3,
        quiz.question4,
        quiz.question5
      ];


      /*
       * =========================================
       * CONTRÔLES DE SÉCURITÉ
       * =========================================
       */

      const cleanQuestions =
        questions.map(
          (question, index) => {

            if (!question) {
              throw new Error(
                `Question ${index + 1} absente.`
              );
            }


            /*
             * Vérification réponses
             */

            if (
              !Array.isArray(
                question.answers
              ) ||
              question.answers.length !== 4
            ) {

              throw new Error(
                `La question ${index + 1} ne contient pas exactement 4 réponses.`
              );
            }


            /*
             * Nettoyage des réponses
             */

            question.answers =
              question.answers.map(
                answer =>
                  String(answer).trim()
              );


            /*
             * Sécurisation bonne réponse
             */

            question.correctAnswer =
              clampCorrectAnswer(
                question.correctAnswer
              );


            /*
             * Sécurisation scoring risque
             */

            question.risk.initialProbability =
              clampValue(
                question.risk.initialProbability
              );

            question.risk.initialImpact =
              clampValue(
                question.risk.initialImpact
              );

            question.risk.reducedProbability =
              clampValue(
                question.risk.reducedProbability
              );


            /*
             * La bonne décision ne peut pas
             * augmenter la probabilité du risque
             */

            if (
              question.risk.reducedProbability >
              question.risk.initialProbability
            ) {

              question.risk.reducedProbability =
                question.risk.initialProbability;
            }


            return question;
          }
        );


      /*
       * =========================================
       * LOG DEBUG
       * =========================================
       */

      console.log(
        "Quiz PirateRisks généré :",
        cleanQuestions.length,
        "questions"
      );


      /*
       * =========================================
       * RÉPONSE AU FRONTEND
       * =========================================
       */

      res.json({
        questions: cleanQuestions
      });


    } catch (error) {

      console.error(
        "Erreur PirateRisks Lab :",
        error
      );


      res.status(500).json({
        error:
          "Impossible de générer le quiz."
      });
    }

  }
);


/*
 * =========================================
 * DÉMARRAGE SERVEUR
 * =========================================
 */

app.listen(
  3001,
  () => {

    console.log(
      "🏴‍☠️ PirateRisks Lab lancé sur http://localhost:3001"
    );

  }
);