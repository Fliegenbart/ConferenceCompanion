type LogLevel = "info" | "warn" | "error";

type PilotLogPayload = {
  level: LogLevel;
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
};

function redactMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) {
    return undefined;
  }

  const copy = { ...metadata };

  if ("token" in copy) {
    copy.token = "[redacted]";
  }

  if ("access_token" in copy) {
    copy.access_token = "[redacted]";
  }

  return copy;
}

async function sendWebhook(payload: PilotLogPayload) {
  const webhookUrl = process.env.PILOT_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...payload,
        metadata: redactMetadata(payload.metadata),
      }),
    });
  } catch (error) {
    console.error("Failed to deliver pilot alert webhook", error);
  }
}

export async function logPilotEvent(level: LogLevel, event: string, message: string, metadata?: Record<string, unknown>) {
  const payload: PilotLogPayload = {
    level,
    event,
    message,
    metadata: redactMetadata(metadata),
  };

  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }

  if (level !== "info") {
    await sendWebhook(payload);
  }
}

export async function reportPilotError(event: string, error: unknown, metadata?: Record<string, unknown>) {
  await logPilotEvent(
    "error",
    event,
    error instanceof Error ? error.message : "Unknown error",
    metadata,
  );
}
