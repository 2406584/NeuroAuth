-- AlterTable
ALTER TABLE "users" ADD COLUMN     "neuro" BOOLEAN;

-- CreateTable
CREATE TABLE "users_login" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "attempt" BIGINT,
    "success" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_login_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_id_key" ON "users_login"("id");

-- AddForeignKey
ALTER TABLE "users_login" ADD CONSTRAINT "users_login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
