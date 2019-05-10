export const env = "dev";

export const dev = {
  MI3D_API_URL: "http://premex.microservices.mi3d.cases-dev.expedia.org/api/",
  BLUEDOG_API_URL: "http://premex.bluedog.repository-dev.expedia.org/api/",
  DOCUMENT_BUILDER_API_URL:
    "http://premex.microservices.documentbuilder-dev.expedia.org/api/",
  EMAIL_MANAGEMENT_API_URL:
    "http://premex.microservices.emailmanagement-dev.expedia.org/api/"
};

export const qa = {
  MI3D_API_URL: "http://premex.microservices.mi3d.cases-qa.expedia.org/api/",
  BLUEDOG_API_URL: "http://premex.bluedog.repository-qa.expedia.org/api/",
  DOCUMENT_BUILDER_API_URL:
    "http://premex.microservices.documentbuilder-qa.expedia.org/api/",
  EMAIL_MANAGEMENT_API_URL:
    "http://premex.microservices.emailmanagement-qa.expedia.org/api/"
};

export const prod = {
  MI3D_API_URL: "http://premex.microservices.mi3d.cases.expedia.org/api/",
  BLUEDOG_API_URL: "http://premex.bluedog.repository.expedia.org/api/",
  DOCUMENT_BUILDER_API_URL:
    "http://premex.microservices.documentbuilder.expedia.org/api/",
  EMAIL_MANAGEMENT_API_URL:
    "http://premex.microservices.emailmanagement.expedia.org/api/"
};

export const getBluedogEndpoint = environment => {
  if (environment !== undefined && environment === "local")
    return "http://localhost:60864/api/";

  if (environment !== undefined && environment === "dev")
    return dev.BLUEDOG_API_URL;

  switch (process.env.REACT_APP_ENV) {
    case "DEVELOPMENT":
      return dev.BLUEDOG_API_URL;
    case "QA":
      return qa.BLUEDOG_API_URL;
    case "PRODUCTION":
      return prod.BLUEDOG_API_URL;
    default:
      return "http://localhost:60864/api/";
  }
};

export const getCasesEndpoint = environment => {
  if (environment !== undefined && environment === "local")
    return "http://localhost:50601/api/";

  if (environment !== undefined && environment === "dev")
    return dev.MI3D_API_URL;

  if (environment !== undefined && environment === "qa") return qa.MI3D_API_URL;

  switch (process.env.REACT_APP_ENV) {
    case "DEVELOPMENT":
      return dev.MI3D_API_URL;
    case "QA":
      return qa.MI3D_API_URL;
    case "PRODUCTION":
      return prod.MI3D_API_URL;
    default:
      break;
  }
};

export const getDocumentBuilderEndpoint = environment => {
  if (environment !== undefined && environment === "local")
    return "http://localhost:63999/api/";

  if (environment !== undefined && environment === "dev")
    return dev.DOCUMENT_BUILDER_API_URL;

  if (environment !== undefined && environment === "qa")
    return qa.DOCUMENT_BUILDER_API_URL;

  switch (process.env.REACT_APP_ENV) {
    case "DEVELOPMENT":
      return dev.DOCUMENT_BUILDER_API_URL;
    case "QA":
      return qa.DOCUMENT_BUILDER_API_URL;
    case "PRODUCTION":
      return prod.DOCUMENT_BUILDER_API_URL;
    default:
      break;
  }
};

export const getEmailManagementEndpoint = environment => {
  // if (environment !== undefined && environment === "local")
  //   return "http://localhost:50601/api/";

  if (environment !== undefined && environment === "dev")
    return dev.EMAIL_MANAGEMENT_API_URL;

  switch (process.env.REACT_APP_ENV) {
    case "DEVELOPMENT":
      return dev.EMAIL_MANAGEMENT_API_URL;
    case "QA":
      return qa.EMAIL_MANAGEMENT_API_URL;
    case "PRODUCTION":
      return prod.EMAIL_MANAGEMENT_API_URL;
    default:
      break;
  }
};
