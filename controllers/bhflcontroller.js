const {
  fibonacciSeries,
  filterPrimes,
  calculateLCM,
  calculateHCF
} = require("../utils/mathutils");

const { getAIResponse } = require("../utils/aiutils");
const { successResponse, errorResponse } = require("../utils/responseutils");

exports.handleBFHL = async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);

    if (keys.length !== 1) {
      return errorResponse(res, 400, "Invalid request format");
    }

    const key = keys[0];
    const value = req.body[key];

    let data;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value < 0) {
          return errorResponse(res, 400, "Invalid fibonacci input");
        }
        data = fibonacciSeries(value);
        break;

      case "prime":
        if (!Array.isArray(value)) {
          return errorResponse(res, 400, "Invalid prime input");
        }
        data = filterPrimes(value);
        break;

      case "lcm":
        if (!Array.isArray(value)) {
          return errorResponse(res, 400, "Invalid lcm input");
        }
        data = calculateLCM(value);
        break;

      case "hcf":
        if (!Array.isArray(value)) {
          return errorResponse(res, 400, "Invalid hcf input");
        }
        data = calculateHCF(value);
        break;

      case "AI":
        if (typeof value !== "string") {
          return errorResponse(res, 400, "Invalid AI input");
        }
        try {
          data = await getAIResponse(value);
        } catch (aiErr) {
          return errorResponse(res, 500, "AI service unavailable: " + aiErr.message);
        }
        break;

      default:
        return errorResponse(res, 400, "Unsupported key");
    }

    return successResponse(res, data);
  } catch (err) {
    next(err);
  }
};
