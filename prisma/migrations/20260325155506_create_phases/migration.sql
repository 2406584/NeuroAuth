-- CreateTable
CREATE TABLE "phases" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phases_id_key" ON "phases"("id");

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
