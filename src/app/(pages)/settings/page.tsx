"use client";
import { toast } from "react-toastify";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  User,
  MapPin,
  Shield,
  Bell,
  Trash2,
  Save,
  Loader2,
  LockKeyhole,
  Globe,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const DIVISIONS_JSON = "/Data/divisions.json";
const DISTRICTS_JSON = "/Data/districts.json";
const UPAZILAS_JSON = "/Data/upazilas.json";

type Division = {
  id: string | number;
  name: string;
  bn_name?: string;
};

type District = {
  id: string | number;
  division_id: string | number;
  name: string;
  bn_name?: string;
};

type Upazila = {
  id: string | number;
  district_id: string | number;
  name: string;
  bn_name?: string;
};

type CustomerData = {
  fullName?: string | null;
  phone?: string | null;
  address?: string | null;
  area?: string | null;
  district?: string | null;
  division?: string | null;
  upazila?: string | null;
};

type UserData = {
  id?: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string;
  status?: string;
  customer?: CustomerData | null;
};

type ProfileState = {
  fullName: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  address: string;
};

type LoginMethod = "google" | "password" | "other";

function normalize(value?: string | null) {
  return (value || "").trim().toLocaleLowerCase();
}

function matchesName(
  item: { name: string; bn_name?: string },
  savedName: string,
) {
  const saved = normalize(savedName);
  return (
    !!saved &&
    (normalize(item.name) === saved || normalize(item.bn_name) === saved)
  );
}

async function readResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Request failed (${response.status})`,
    );
  }

  return payload;
}

export default function AccountSettingsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<
    "profile" | "address" | "security" | "delete"
  >("profile");

  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    area: "",
    address: "",
  });

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("other");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const loadLocationData = useCallback(async () => {
    const [divisionResponse, districtResponse, upazilaResponse] =
      await Promise.all([
        fetch(DIVISIONS_JSON, { cache: "no-store" }),
        fetch(DISTRICTS_JSON, { cache: "no-store" }),
        fetch(UPAZILAS_JSON, { cache: "no-store" }),
      ]);

    if (!divisionResponse.ok || !districtResponse.ok || !upazilaResponse.ok) {
      throw new Error("Location JSON লোড হয়নি। public/Data ফোল্ডার চেক করো।");
    }

    const [divisionData, districtData, upazilaData] = await Promise.all([
      divisionResponse.json(),
      districtResponse.json(),
      upazilaResponse.json(),
    ]);

    if (
      !Array.isArray(divisionData) ||
      !Array.isArray(districtData) ||
      !Array.isArray(upazilaData)
    ) {
      throw new Error("Location JSON ফাইলের format সঠিক নয়।");
    }

    setDivisions(divisionData);
    setDistricts(districtData);
    setUpazilas(upazilaData);

    return {
      divisions: divisionData as Division[],
      districts: districtData as District[],
      upazilas: upazilaData as Upazila[],
    };
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("তুমি লগইন করা নেই। প্রথমে লগইন করো।");
      }

      const {
        data: { user: authUser },
        error: authUserError,
      } = await supabase.auth.getUser();

      if (authUserError) throw authUserError;
      if (!authUser) throw new Error("Authenticated user পাওয়া যায়নি।");

      // Supabase-এর login provider শনাক্ত করা
      const providers: string[] =
        authUser.app_metadata?.providers ||
        authUser.identities?.map((identity) => identity.provider) ||
        [];

      const hasEmailProvider = providers.includes("email");
      const hasGoogleProvider = providers.includes("google");

      setLoginMethod(
        hasEmailProvider ? "password" : hasGoogleProvider ? "google" : "other",
      );

      const userResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const userPayload = await readResponse(userResponse);
      const user: UserData = userPayload?.user || userPayload;
      const customer: CustomerData = user?.customer || {};

      const savedDivision = customer.division || "";
      const savedDistrict = customer.district || "";
      const savedUpazila = customer.upazila || "";

      setProfile({
        fullName: user.fullName || "",
        email: user.email || authUser.email || "",
        phone: user.phone || "",
        division: savedDivision,
        district: savedDistrict,
        upazila: savedUpazila,
        area: customer.area || "",
        address: customer.address || "",
      });

      const locationData = await loadLocationData();

      const matchedDivision = locationData.divisions.find((item) =>
        matchesName(item, savedDivision),
      );

      const divisionId = matchedDivision ? String(matchedDivision.id) : "";

      setSelectedDivisionId(divisionId);

      const matchedDistrict = matchedDivision
        ? locationData.districts.find(
            (item) =>
              String(item.division_id) === divisionId &&
              matchesName(item, savedDistrict),
          )
        : undefined;

      const districtId = matchedDistrict ? String(matchedDistrict.id) : "";

      setSelectedDistrictId(districtId);

      const matchedUpazila = matchedDistrict
        ? locationData.upazilas.find(
            (item) =>
              String(item.district_id) === districtId &&
              matchesName(item, savedUpazila),
          )
        : undefined;

      setSelectedUpazilaId(matchedUpazila ? String(matchedUpazila.id) : "");
    } catch (error) {
      console.error("Load Settings Error:", error);
      toast.error(error instanceof Error
          ? error.message
          : "Settings লোড করতে সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  }, [supabase, loadLocationData]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const filteredDistricts = useMemo(() => {
    if (!selectedDivisionId) return [];

    return districts.filter(
      (district) => String(district.division_id) === selectedDivisionId,
    );
  }, [districts, selectedDivisionId]);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];

    return upazilas.filter(
      (upazila) => String(upazila.district_id) === selectedDistrictId,
    );
  }, [upazilas, selectedDistrictId]);

  function displayName(item: { name: string; bn_name?: string }) {
    return item.bn_name ? `${item.bn_name} (${item.name})` : item.name;
  }

  function handleProfileChange(field: keyof ProfileState, value: string) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleDivisionChange(divisionId: string) {
    const division = divisions.find((item) => String(item.id) === divisionId);

    setSelectedDivisionId(divisionId);
    setSelectedDistrictId("");
    setSelectedUpazilaId("");

    setProfile((previous) => ({
      ...previous,
      division: division?.name || "",
      district: "",
      upazila: "",
    }));
  }

  function handleDistrictChange(districtId: string) {
    const district = filteredDistricts.find(
      (item) => String(item.id) === districtId,
    );

    setSelectedDistrictId(districtId);
    setSelectedUpazilaId("");

    setProfile((previous) => ({
      ...previous,
      district: district?.name || "",
      upazila: "",
    }));
  }

  function handleUpazilaChange(upazilaId: string) {
    const upazila = filteredUpazilas.find(
      (item) => String(item.id) === upazilaId,
    );

    setSelectedUpazilaId(upazilaId);

    setProfile((previous) => ({
      ...previous,
      upazila: upazila?.name || "",
    }));
  }

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("তুমি লগইন করা নেই।");
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: profile.fullName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          division: profile.division,
          district: profile.district,
          upazila: profile.upazila,
          area: profile.area.trim(),
          address: profile.address.trim(),
        }),
      });

      await readResponse(response);
      toast.success("Profile এবং Address সফলভাবে সংরক্ষণ করা হয়েছে।");
    } catch (error) {
      console.error("Save Profile Error:", error);
      toast.error(error instanceof Error
          ? error.message
          : "Profile save করতে সমস্যা হয়েছে।",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (loginMethod !== "password") {
      toast.warning("এই login method-এর জন্য password পরিবর্তন উপলভ্য নয়।");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("সব password field পূরণ করো।");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("নতুন password কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("New Password এবং Confirm Password মিলছে না।");
      return;
    }

    if (currentPassword === newPassword) {
      toast.warning("নতুন password আগের password থেকে আলাদা হতে হবে।");
      return;
    }

    try {
      setChangingPassword(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user?.email) {
        throw new Error("Account email পাওয়া যায়নি।");
      }

      // বর্তমান password যাচাই
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error("Current password সঠিক নয়। আবার চেষ্টা করো।");
      }

      // Supabase Auth-এ নতুন password সংরক্ষণ
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password সফলভাবে পরিবর্তন হয়েছে।");
    } catch (error) {
      console.error("Change Password Error:", error);
      toast.error(error instanceof Error
          ? error.message
          : "Password পরিবর্তন করতে সমস্যা হয়েছে।",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setDeletingAccount(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("তুমি লগইন করা নেই।");
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      await readResponse(response);
      await supabase.auth.signOut();

      toast.info("তোমার অ্যাকাউন্ট মুছে ফেলা হয়েছে।");
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Delete Account Error:", error);
      toast.error(error instanceof Error
          ? error.message
          : "অ্যাকাউন্ট মুছতে সমস্যা হয়েছে।",
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#12233F]">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="h-fit rounded-2xl bg-white p-3 shadow-sm">
            <SidebarButton
              active={activeTab === "profile"}
              icon={<User className="h-4 w-4" />}
              label="Profile"
              onClick={() => setActiveTab("profile")}
            />

            <SidebarButton
              active={activeTab === "address"}
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              onClick={() => setActiveTab("address")}
            />

            <SidebarButton
              active={activeTab === "security"}
              icon={<Shield className="h-4 w-4" />}
              label="Security"
              onClick={() => setActiveTab("security")}
            />

            <button
              type="button"
              disabled
              title="Notifications আপাতত বন্ধ রাখা হয়েছে"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 opacity-60"
            >
              <Bell className="h-4 w-4" />
              Notifications (Coming Soon)
            </button>

            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setActiveTab("delete");
              }}
              className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === "delete"
                  ? "bg-red-50 text-red-600"
                  : "text-red-500 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {activeTab === "profile" && (
              <section>
                <SectionHeader
                  title="Profile Information"
                  description="Update your basic account information."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    value={profile.fullName}
                    onChange={(value) => handleProfileChange("fullName", value)}
                  />

                  <InputField
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(value) => handleProfileChange("email", value)}
                  />

                  <InputField
                    label="Phone"
                    value={profile.phone}
                    onChange={(value) => handleProfileChange("phone", value)}
                  />
                </div>

                <SaveButton
                  loading={savingProfile}
                  text="Save Changes"
                  onClick={handleSaveProfile}
                />
              </section>
            )}

            {activeTab === "address" && (
              <section>
                <SectionHeader
                  title="Address Information"
                  description="Choose your location and save your address."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Division"
                    value={selectedDivisionId}
                    onChange={handleDivisionChange}
                    options={divisions.map((item) => ({
                      id: String(item.id),
                      label: displayName(item),
                    }))}
                    placeholder="Select Division"
                  />

                  <SelectField
                    label="District"
                    value={selectedDistrictId}
                    onChange={handleDistrictChange}
                    disabled={!selectedDivisionId}
                    options={filteredDistricts.map((item) => ({
                      id: String(item.id),
                      label: displayName(item),
                    }))}
                    placeholder="Select District"
                  />

                  <SelectField
                    label="Upazila"
                    value={selectedUpazilaId}
                    onChange={handleUpazilaChange}
                    disabled={!selectedDistrictId}
                    options={filteredUpazilas.map((item) => ({
                      id: String(item.id),
                      label: displayName(item),
                    }))}
                    placeholder="Select Upazila"
                  />

                  <InputField
                    label="Area"
                    value={profile.area}
                    placeholder="Your area"
                    onChange={(value) => handleProfileChange("area", value)}
                  />

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Address
                    </label>
                    <textarea
                      value={profile.address}
                      onChange={(event) =>
                        handleProfileChange("address", event.target.value)
                      }
                      rows={4}
                      placeholder="House, road, village, landmark..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
                    />
                  </div>
                </div>

                <SaveButton
                  loading={savingProfile}
                  text="Save Address"
                  onClick={handleSaveProfile}
                />
              </section>
            )}

            {activeTab === "security" && (
              <section>
                <SectionHeader
                  title="Security"
                  description="Manage your account login security."
                />

                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    {loginMethod === "google" ? (
                      <Globe className="mt-0.5 h-5 w-5 text-[#12233F]" />
                    ) : (
                      <LockKeyhole className="mt-0.5 h-5 w-5 text-[#12233F]" />
                    )}

                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">
                        Login Method
                      </h3>

                      {loginMethod === "google" ? (
                        <>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            তুমি Google দিয়ে লগইন করেছ। তোমার অ্যাকাউন্ট
                            Google-এর সঙ্গে সংযুক্ত আছে।
                          </p>

                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Connected with Google
                          </div>
                        </>
                      ) : loginMethod === "password" ? (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          তুমি Email/Password দিয়ে লগইন করেছ। নিচে পাসওয়ার্ড
                          পরিবর্তন করতে পারবে।
                        </p>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          এই login method-এর জন্য পাসওয়ার্ড পরিবর্তন এখানে
                          উপলভ্য নয়।
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {loginMethod === "password" && (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-[#12233F]">
                        Change Password
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।
                      </p>
                    </div>

                    <form
                      className="max-w-xl space-y-5"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void handleChangePassword();
                      }}
                    >
                      <PasswordField
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        visible={showPasswords}
                        autoComplete="current-password"
                        placeholder="Enter current password"
                      />

                      <PasswordField
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        visible={showPasswords}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        minLength={8}
                      />

                      <PasswordField
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        visible={showPasswords}
                        autoComplete="new-password"
                        placeholder="Enter new password again"
                        minLength={8}
                      />

                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={showPasswords}
                          onChange={(event) =>
                            setShowPasswords(event.target.checked)
                          }
                          className="h-4 w-4 accent-[#12233F]"
                        />
                        Show passwords
                      </label>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={changingPassword}
                          className="flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a3155] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {changingPassword ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}

                          {changingPassword
                            ? "Changing Password..."
                            : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </section>
            )}

            {activeTab === "delete" && (
              <section>
                <SectionHeader
                  title="Delete Account"
                  description="Permanently delete your account."
                />

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <div className="flex items-start gap-3">
                    <Trash2 className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                      <h3 className="font-medium text-red-700">
                        Account deletion
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-red-600">
                        এই কাজটি স্থায়ী। অ্যাকাউন্ট মুছে ফেললে তোমার তথ্য ও
                        অ্যাকাউন্টে প্রবেশের সুযোগ হারাতে পারো।
                      </p>
                    </div>
                  </div>

                  {confirmDelete && (
                    <p className="mt-4 text-sm font-medium text-red-700">
                      তুমি কি নিশ্চিত যে অ্যাকাউন্টটি স্থায়ীভাবে মুছতে চাও?
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    {confirmDelete && (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={deletingAccount}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleDeleteAccount()}
                      disabled={deletingAccount}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingAccount ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      {deletingAccount
                        ? "Deleting..."
                        : confirmDelete
                          ? "Confirm Delete"
                          : "Delete My Account"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active ? "bg-[#12233F] text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[#12233F]">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  autoComplete,
  placeholder,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  autoComplete: string;
  placeholder: string;
  minLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </span>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SaveButton({
  loading,
  text,
  onClick,
}: {
  loading: boolean;
  text: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a3155] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {loading ? "Saving..." : text}
      </button>
    </div>
  );
}
