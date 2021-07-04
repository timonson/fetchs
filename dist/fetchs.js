var __awaiter = (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
class FetchSError extends Error {
  constructor(message, status, statusText) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = this.constructor.name;
  }
}
export const fetchS = (input, init) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(input, init).catch((err) => {
      throw new FetchSError(err.message, 0, "Network Error");
    });
    if (!res.ok) {
      throw new FetchSError(
        `Received status code ${res.status} instead of 200-299 range`,
        res.status,
        res.statusText,
      );
    }
    try {
      switch (init === null || init === void 0 ? void 0 : init.bodyMethod) {
        case "arrayBuffer":
          return yield res.arrayBuffer();
        case "blob":
          return yield res.blob();
        case "formData":
          return yield res.formData();
        case "json":
          return yield res.json();
        case "text":
          return yield res.text();
        case "uint8Array":
          return new Uint8Array(yield res.arrayBuffer());
        default:
          return res.body;
      }
    } catch (err) {
      throw new FetchSError(err.message, res.status, res.statusText);
    }
  });
