let income=0, expenditure=0, balance=0;
let income_arr=[], expenditure_arr=[];
let pie_labels=[], pie_data=[];
let colors=[];
let barChartInstance=null;
let pieChartInstance=null;
let spendingChartInstance=null;
let currentRole="";
let sortField=null, sortAsc=true;

let transactions = [
    {
        D:"08-04-2026",
        De:"Online Course",
        T:"expenditure",
        A:2500
    },
    {
        D:"02-04-2026",
        De:"Freelancing",
        T:"income",
        A:1500
    },
    {
        D:"14-04-2026",
        De:"Shopping",
        T:"expenditure",
        A:3500
    },
    {
        D:"05-04-2026",
        De:"Salary",
        T:"income",
        A:20000
    },
    {
        D:"11-04-2026",
        De:"Movie Night",
        T:"expenditure",
        A:600
    },
    {
        D:"01-04-2026",
        De:"Opening Balance",
        T:"income",
        A:5000
    },
    {
        D:"10-04-2026",
        De:"Mobile Recharge",
        T:"expenditure",
        A:500
    },
    {
        D:"07-04-2026",
        De:"Fuel",
        T:"expenditure",
        A:1500
    },
    {
        D:"13-04-2026",
        De:"Gift Received",
        T:"income",
        A:1500
    },
    {
        D:"03-04-2026",
        De:"Groceries",
        T:"expenditure",
        A:800
    },
    {
        D:"15-04-2026",
        De:"Bonus",
        T:"income",
        A:7000
    },
    {
        D:"06-04-2026",
        De:"Dining Out",
        T:"expenditure",
        A:900
    },
    {
        D:"12-04-2026",
        De:"Part-time Job",
        T:"income",
        A:4000
    },
    {
        D:"04-04-2026",
        De:"Electricity Bill",
        T:"expenditure",
        A:1200
    },
    {
        D:"09-04-2026",
        De:"Stock Profit",
        T:"income",
        A:3000
    }
];

// darked
function toggleDark(){
    let html=document.documentElement;
    let isDark=html.getAttribute("data-theme")==="dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    document.getElementById("darkIcon").className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
    document.getElementById("darkLabel").textContent = isDark ? "Dark" : "Light";
}

// csv download 
function exportCSV(){
    let rows=["Date,Description,Type,Amount"];
    for(let t of transactions){
        rows.push(`${t.D},${t.De},${t.T},${t.A}`);
    }
    let csv=rows.join("\n");
    let blob=new Blob([csv],{type:"text/csv"});
    let url=URL.createObjectURL(blob);
    let a=document.createElement("a");
    a.href=url;
    a.download="transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// sort
function sortBy(field){
    if(sortField===field){ sortAsc=!sortAsc; }
    else { sortField=field; sortAsc=true; }

    document.getElementById("sortDateBtn").classList.remove("active");
    document.getElementById("sortAmtBtn").classList.remove("active");
    document.getElementById("sortDateDir").textContent="";
    document.getElementById("sortAmtDir").textContent="";

    if(field==="date"){
        document.getElementById("sortDateBtn").classList.add("active");
        document.getElementById("sortDateDir").textContent= sortAsc ? " ↑" : " ↓";
        transactions.sort((a,b)=>{ let da=parseDMY(a.D), db=parseDMY(b.D); return sortAsc ? da-db : db-da; });
    } else {
        document.getElementById("sortAmtBtn").classList.add("active");
        document.getElementById("sortAmtDir").textContent= sortAsc ? " ↑" : " ↓";
        transactions.sort((a,b)=> sortAsc ? a.A-b.A : b.A-a.A);
    }
    cards_prints();
    print_transaction();
}

function parseDMY(str){
    let p=str.split("-");
    return new Date(`${p[2]}-${p[1]}-${p[0]}`);
}

function clearSort(){
    sortField=null; sortAsc=true;
    document.getElementById("sortDateBtn").classList.remove("active");
    document.getElementById("sortAmtBtn").classList.remove("active");
    document.getElementById("sortDateDir").textContent="";
    document.getElementById("sortAmtDir").textContent="";
    print_transaction();
}

// cards
function cards_prints(){
    arrayworks();
    balanceCal();
    charts();
}

function arrayworks(){
    income_arr=[]; expenditure_arr=[];
    pie_labels=[]; pie_data=[];
    income=0; expenditure=0;

    for(let t of transactions){
        if(t.T==="income"){
            income_arr.push(t.A);
            expenditure_arr.push(0);
        } else {
            expenditure_arr.push(t.A);
            income_arr.push(0);
            pie_labels.push(t.De);
            pie_data.push(t.A);
        }
    }

    for(let i=0;i<income_arr.length;i++){
        income+=income_arr[i];
        expenditure+=expenditure_arr[i];
    }

    document.getElementById("income").innerHTML=income;
    document.getElementById("expenditure").innerHTML=expenditure;
}

function balanceCal(){
    balance=income-expenditure;
    document.getElementById("balance").innerHTML=balance;
}

// charts
function generateColors(){
    colors=[];
    for(let i=0;i<pie_labels.length;i++){
        let r=Math.floor(Math.random()*256);
        let g=Math.floor(Math.random()*256);
        let b=Math.floor(Math.random()*256);
        colors.push(`rgb(${r},${g},${b})`);
    }
}

function charts(){
    generateColors();
    let xValues=transactions.map((_,i)=>i+1);

    if(barChartInstance) barChartInstance.destroy();
    if(pieChartInstance) pieChartInstance.destroy();
    if(spendingChartInstance) spendingChartInstance.destroy();

    barChartInstance=new Chart("barChart",{
        type:"line",
        data:{
            labels:xValues,
            datasets:[
                {label:"Expenditure",data:expenditure_arr,borderColor:"red",fill:false},
                {label:"Income",data:income_arr,borderColor:"green",fill:false}
            ]
        }
    });

    pieChartInstance=new Chart("piChart",{
        type:"pie",
        data:{
            labels:pie_labels,
            datasets:[{backgroundColor:colors,data:pie_data}]
        }
    });

    let arr1=[0];
    let merged = pie_data.concat(arr1);

    spendingChartInstance = new Chart("spending_chart", {
        type: "bar",
        data: {
            labels: pie_labels,
            datasets: [{
                label: "Spending",
                data: merged,
                backgroundColor: "red",
                borderColor: "black",
                borderWidth: 1
            }]
        }
    });

    // Insights
    let balancePercent=(balance/income)*100;
    document.getElementById("sav_per").textContent=balancePercent.toFixed(2);

    let maxExpAmt=Math.max(...expenditure_arr);
    let HD="";
    for(let t of transactions){
        if(t.A===maxExpAmt && t.T==="expenditure"){ HD=t.De; break; }
    }
    document.getElementById("high_transaction").textContent=`${maxExpAmt} on ${HD}`;

    let latestTransaction=transactions.reduce((latest,curr)=>{
        return parseDMY(curr.D) > parseDMY(latest.D) ? curr : latest;
    });
    document.getElementById("L_T").textContent=`${latestTransaction.D} → ${latestTransaction.De} (₹${latestTransaction.A})`;
    document.getElementById("T_T").textContent=transactions.length;

    let maxIndex=pie_data.indexOf(Math.max(...pie_data));
    let maxCategory=pie_labels[maxIndex];
    let expensePercent=(expenditure/income)*100;
    let percent=expensePercent.toFixed(2);
    let message="";
    if(percent>70) message=`⚠️ Very high spending! ${percent}% of your income is going to expenses, mainly on ${maxCategory}. Control immediately.`;
    else if(percent>50) message=`You are spending more (${percent}%) on ${maxCategory}. Try to reduce it.`;
    else if(percent>30) message=`Moderate spending (${percent}%). Keep an eye on ${maxCategory}.`;
    else message=`Great! Only ${percent}% spent. Your expenses are well managed.`;
    document.getElementById("suggesstion").textContent=message;
}

// TABLE
function print_transaction(){
    renderTable(transactions);
}

function renderTable(data){
    let tbody=document.getElementById("transaction_data");
    tbody.innerHTML="";
    let isAdmin=currentRole==="admin";

    for(let i=0;i<data.length;i++){
        let t=data[i];
        let realIndex=transactions.indexOf(t);
        let tr=document.createElement("tr");

        let typeClass = t.T==='income' ? 'type-income' : 'type-expense';

        let actionsCell = isAdmin
            ? `<td>
                <button class="btn-edit" onclick="openEdit(${realIndex})"><i class="fa-solid fa-pen" style="font-size:10px;"></i> Edit</button>
                <button class="btn-delete ms-1" onclick="deleteTransaction(${realIndex})"><i class="fa-solid fa-trash" style="font-size:10px;"></i> Del</button>
               </td>`
            : "";

        tr.innerHTML=`
            <td>${realIndex+1}</td>
            <td>${t.D}</td>
            <td>${t.De}</td>
            <td><span class="type-badge ${typeClass}">${t.T}</span></td>
            <td><strong>₹${t.A}</strong></td>
            ${actionsCell}
        `;
        tbody.appendChild(tr);
    }
}

// ADD
function formatDate(dateStr){
    if(!dateStr) return "";
    let parts=dateStr.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function add(){
    let date=formatDate(document.getElementById("date").value);
    let desc=document.getElementById("description").value;
    let type=document.getElementById("type").value;
    let amt=Number(document.getElementById("amount").value);

    if(!date||!desc||!type||!amt) return alert("Please fill all fields.");

    transactions.push({D:date,De:desc,T:type,A:amt});

    document.getElementById("date").value="";
    document.getElementById("description").value="";
    document.getElementById("type").value="";
    document.getElementById("amount").value="";

    cards_prints();
    print_transaction();
}

//EDIT
function openEdit(index){
    let t=transactions[index];
    document.getElementById("editIndex").value=index;
    let parts=t.D.split("-");
    document.getElementById("editDate").value=`${parts[2]}-${parts[1]}-${parts[0]}`;
    document.getElementById("editDesc").value=t.De;
    document.getElementById("editType").value=t.T;
    document.getElementById("editAmt").value=t.A;
    document.getElementById("editModal").classList.add("show");
}

function closeModal(){
    document.getElementById("editModal").classList.remove("show");
}

function saveEdit(){
    let index=Number(document.getElementById("editIndex").value);
    let rawDate=document.getElementById("editDate").value;
    let parts=rawDate.split("-");
    let formattedDate=`${parts[2]}-${parts[1]}-${parts[0]}`;

    transactions[index]={
        D:formattedDate,
        De:document.getElementById("editDesc").value,
        T:document.getElementById("editType").value,
        A:Number(document.getElementById("editAmt").value)
    };

    closeModal();
    cards_prints();
    print_transaction();
}

// DELETE
function deleteTransaction(index){
    if(!confirm("Delete this transaction?")) return;
    transactions.splice(index,1);
    cards_prints();
    print_transaction();
}

// SEARCH 
function search(){
    let searchDate=document.getElementById("search_date").value.toLowerCase();
    let searchDesc=document.getElementById("search_description").value.toLowerCase();
    let searchType=document.getElementById("search_type").value.toLowerCase();

    let filtered=transactions.filter(t=>(
        (searchDate===""||t.D.toLowerCase().includes(searchDate))&&
        (searchDesc===""||t.De.toLowerCase().includes(searchDesc))&&
        (searchType===""||t.T.toLowerCase().includes(searchType))
    ));

    renderTable(filtered);
}

// role codes
document.getElementById("roleSelect").addEventListener("change",function(){
    currentRole=this.value;
    let isAdmin=currentRole==="admin";
    document.getElementById("hide").style.display=isAdmin?"block":"none";
    document.getElementById("actionsHeader").style.display=isAdmin?"":"none";
    // Show Clear sort button only for admin
    document.getElementById("clearSortBtn").style.display=isAdmin?"inline-flex":"none";
    print_transaction();
});

// close codes
document.getElementById("editModal").addEventListener("click",function(e){
    if(e.target===this) closeModal();
});


cards_prints();
print_transaction();