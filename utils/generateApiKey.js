import crypto from "crypto"

function generateApiKey() {
  return crypto.randomBytes(15).toString("hex")
}

export default generateApiKey

