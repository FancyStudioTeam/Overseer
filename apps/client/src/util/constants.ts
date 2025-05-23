import { OAuth2Scope, createOAuth2Link } from "@discordeno/bot";
import { client } from "./client.js";

export const APPLICATION_ID = client.applicationId;

export const CUSTOM_EMOJIS = {
  ARROW_DOWN_UP: "<:_:1350555752049152162>",
  BOLT: "<:_:1348780297436532798>",
  BOOK_TYPE: "<:_:1348771323954073640>",
  CIRCLE_CHECK: "<:_:1350248256344428737>",
  CIRCLE_MINUS: "<:_:1348777416750927915>",
  CIRCLE_PLUS: "<:_:1348775632540008501>",
  CIRCLE_X: "<:_:1350247573289435168>",
  INFO: "<:_:1352328623817887848>",
  LAYOUT_GRID: "<:_:1348771325115629689>",
  TRASH_2: "<:_:1348774265729716264>",
  UNDO: "<:_:1350192629349879840>",
  USERS: "<:_:1348773186241822801>",
};

export const DEFAULT_EMBED_COLOR = 0x2b2d31;
export const GREEN_EMBED_COLOR = 0x00bc7d;
export const RED_EMBED_COLOR = 0xff2056;

export const OAUTH2_INVITE_URL = createOAuth2Link({
  clientId: APPLICATION_ID,
  scope: [OAuth2Scope.Bot],
});

export const STATUS_CODE_LABELS: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  214: "Transformation Applied",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Request Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};
