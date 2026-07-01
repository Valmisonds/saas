import { Webhooks } from "@polar-sh/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";

function planForProductId(productId: string): "plus" | "pro" | "free" {
  if (productId === process.env.POLAR_PRODUCT_PLUS_ID) return "plus";
  if (productId === process.env.POLAR_PRODUCT_PRO_ID) return "pro";
  return "free";
}

async function syncSubscription(params: {
  externalCustomerId?: string | null;
  customerId: string;
  productId: string;
  active: boolean;
}) {
  if (!params.externalCustomerId) return; // checkout wasn't created with customerExternalId — nothing to sync

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({
      plan: params.active ? planForProductId(params.productId) : "free",
      polar_customer_id: params.customerId,
    })
    .eq("id", params.externalCustomerId);
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionActive: async (payload) =>
    syncSubscription({
      externalCustomerId: payload.data.customer.externalId,
      customerId: payload.data.customerId,
      productId: payload.data.productId,
      active: true,
    }),
  onSubscriptionUpdated: async (payload) =>
    syncSubscription({
      externalCustomerId: payload.data.customer.externalId,
      customerId: payload.data.customerId,
      productId: payload.data.productId,
      active: payload.data.status === "active",
    }),
  onSubscriptionCanceled: async (payload) =>
    syncSubscription({
      externalCustomerId: payload.data.customer.externalId,
      customerId: payload.data.customerId,
      productId: payload.data.productId,
      active: false,
    }),
  onSubscriptionRevoked: async (payload) =>
    syncSubscription({
      externalCustomerId: payload.data.customer.externalId,
      customerId: payload.data.customerId,
      productId: payload.data.productId,
      active: false,
    }),
});
