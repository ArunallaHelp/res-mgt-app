-- CreateEnum
CREATE TYPE "priority_level" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('new', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "timeline_event_type" AS ENUM ('status_change', 'verification_change', 'priority_change', 'comment', 'note', 'created');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('unverified', 'pending', 'verified');

-- CreateTable
CREATE TABLE "manager_group_members" (
    "group_id" UUID NOT NULL,
    "manager_id" UUID NOT NULL,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_group_members_pkey" PRIMARY KEY ("group_id","manager_id")
);

-- CreateTable
CREATE TABLE "manager_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manager_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "nearest_town" TEXT NOT NULL,
    "job_role" TEXT NOT NULL,
    "other_role" TEXT,
    "experience_years" TEXT NOT NULL,
    "highest_qualification" TEXT NOT NULL,
    "other_qualification" TEXT,
    "professional_skills" TEXT[],
    "other_skill" TEXT,
    "support_types" TEXT[],
    "grade_levels" TEXT[],
    "subjects" TEXT NOT NULL,
    "other_subject" TEXT,
    "available_days" TEXT[],
    "available_time_slots" TEXT[],
    "teaching_mode" TEXT NOT NULL,
    "support_methods" TEXT[],
    "volunteering_experience" TEXT,
    "preferences_limitations" TEXT,
    "comments" TEXT,
    "is_teacher" BOOLEAN DEFAULT false,
    "verification_status" "verification_status" DEFAULT 'unverified',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "otp_code" TEXT,
    "otp_expires_at" TIMESTAMPTZ(6),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_timeline" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "request_id" UUID NOT NULL,
    "event_type" "timeline_event_type" NOT NULL,
    "event_data" JSONB,
    "comment" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reference_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "grade" TEXT NOT NULL,
    "exam_year" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "flood_impact" TEXT NOT NULL,
    "support_needed" TEXT[],
    "status" "request_status" DEFAULT 'new',
    "verification_status" "verification_status" DEFAULT 'unverified',
    "priority" "priority_level" DEFAULT 'medium',
    "admin_notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "birth_year" TEXT,
    "nearest_town" TEXT,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_managers_created_at" ON "managers"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_managers_district" ON "managers"("district");

-- CreateIndex
CREATE INDEX "idx_managers_email" ON "managers"("email");

-- CreateIndex
CREATE INDEX "idx_managers_phone" ON "managers"("phone");

-- CreateIndex
CREATE INDEX "idx_managers_user_id" ON "managers"("user_id");

-- CreateIndex
CREATE INDEX "idx_managers_verification_status" ON "managers"("verification_status");

-- CreateIndex
CREATE INDEX "idx_timeline_created_at" ON "request_timeline"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_timeline_event_type" ON "request_timeline"("event_type");

-- CreateIndex
CREATE INDEX "idx_timeline_request_id" ON "request_timeline"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "requests_reference_code_key" ON "requests"("reference_code");

-- CreateIndex
CREATE INDEX "idx_requests_created_at" ON "requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_requests_district" ON "requests"("district");

-- CreateIndex
CREATE INDEX "idx_requests_reference_code" ON "requests"("reference_code");

-- CreateIndex
CREATE INDEX "idx_requests_status" ON "requests"("status");

-- CreateIndex
CREATE INDEX "idx_requests_user_id" ON "requests"("user_id");

-- CreateIndex
CREATE INDEX "idx_requests_verification_status" ON "requests"("verification_status");

-- AddForeignKey
ALTER TABLE "manager_group_members" ADD CONSTRAINT "manager_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "manager_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manager_group_members" ADD CONSTRAINT "manager_group_members_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "request_timeline" ADD CONSTRAINT "request_timeline_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
