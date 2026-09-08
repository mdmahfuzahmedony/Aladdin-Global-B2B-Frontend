export function FooterBrand() {
  return (
    <div className="max-w-md">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400">
          🏢
        </div>

        <h2 className="text-xl font-bold">
          Aladdin Global B2B
        </h2>
      </div>

      <p className="mb-6 leading-7 text-blue-200">
        Aladdin Global B2B connects verified wholesale buyers
        and sellers across Bangladesh with genuine products
        and reliable delivery.
      </p>

      <div className="space-y-3 text-sm">

        <p>
          📞 <strong>Call us 10AM–9PM:</strong>{" "}
          01322-130929
        </p>

        <p>
          ✉️ <strong>Email:</strong>{" "}
          support@aladdinglobalb2b.com
        </p>

        <p>
          📍 <strong>Address:</strong>{" "}
          Holding No: Gohata, Road Jashore, Jashore,
          Bangladesh — 7400
        </p>

      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold">
          Follow Us:
        </h3>

        <div className="flex gap-3">
          <SocialButton />
          <SocialButton />
          <SocialButton />
        </div>
      </div>
    </div>
  );
}

function SocialButton() {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#263b5d] transition hover:bg-yellow-400"
    >
      #
    </button>
  );
}