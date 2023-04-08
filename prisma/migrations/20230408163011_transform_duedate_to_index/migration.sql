-- DropIndex
DROP INDEX "registers_recurrency_idx";

-- CreateIndex
CREATE INDEX "registers_recurrency_due_date_idx" ON "registers"("recurrency", "due_date");
