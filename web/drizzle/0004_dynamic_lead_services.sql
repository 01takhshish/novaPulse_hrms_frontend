ALTER TABLE "leads" ALTER COLUMN "service" SET DATA TYPE varchar(120) USING "service"::text;
