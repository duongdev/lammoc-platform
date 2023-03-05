-- DropForeignKey
ALTER TABLE "LoyaltyPointEvent" DROP CONSTRAINT "LoyaltyPointEvent_loyaltyMemberId_fkey";

-- AddForeignKey
ALTER TABLE "LoyaltyPointEvent" ADD CONSTRAINT "LoyaltyPointEvent_loyaltyMemberId_fkey" FOREIGN KEY ("loyaltyMemberId") REFERENCES "LoyaltyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
