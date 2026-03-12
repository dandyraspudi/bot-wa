import baileys from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

const { default: makeWASocket, useMultiFileAuthState } = baileys

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state
  })

  const allowedNumbers = [
    "6282261977043@s.whatsapp.net",
    "6288212810834@s.whatsapp.net"
  ]

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr }) => {

    if (qr) {
      console.log("Scan QR:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("Bot connected")
    }

  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    console.log("message received:", msg)
    if (!msg.message) return

    const receiver = msg.key.remoteJid
     if (allowedNumbers.includes(receiver)) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (text === "halo") {

      await sock.sendMessage(msg.key.remoteJid, {
        text: "Kenapa bub"
      })

    }

    if (text === "lagi ngapain?" || text === "lagi ngapain") {

      await sock.sendMessage(msg.key.remoteJid, {
        text: "Bentar bub lagi agak full"
      })

    }

    if (text === "apa ini?" || text === "apa ini bub?" || text === "apa ini kak?") {

      await sock.sendMessage(msg.key.remoteJid, {
        text: "Ini aku lagi ngetest chat bot 😈"
      })

    }

  })

}

startBot()