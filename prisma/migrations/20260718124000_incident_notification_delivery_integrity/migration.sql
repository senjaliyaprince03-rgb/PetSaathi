-- Each incident notification can mirror one, and only one, concrete outbox item.
CREATE UNIQUE INDEX "incident_notifications_notification_id_key"
  ON "incident_notifications"("notification_id");
