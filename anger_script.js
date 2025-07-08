// anger_script.js

document.addEventListener("DOMContentLoaded", function () {

  const angerButtons = document.getElementById("anger-buttons");

  const reevaluationButtons = document.getElementById("reeval-buttons");

  const recordBtn = document.getElementById("record-btn");

  const recordsDiv = document.getElementById("records");

  const categorySelect = document.getElementById("category");

  const categoryInput = document.getElementById("category-input");

  const categoryHint = document.getElementById("category-hint");

  const angerLevels = [1,2,3,4,5,6,7,8,9,10];

  let selectedAnger = null;

  let selectedReeval = null;

  let recordList = JSON.parse(localStorage.getItem("angerRecords") || "[]");

  function createButtons(container, isReevaluation = false) {

    container.innerHTML = "";

    angerLevels.forEach((level) => {

      const btn = document.createElement("button");

      btn.textContent = level;

      btn.addEventListener("click", () => {

        [...container.children].forEach((b) => b.classList.remove("selected"));

        btn.classList.add("selected");

        if (isReevaluation) {

          selectedReeval = level;

          document.getElementById("reevaluation").value = level;

        } else {

          selectedAnger = level;

          document.getElementById("anger").value = level;

        }

      });

      container.appendChild(btn);

    });

  }

  createButtons(angerButtons);

  createButtons(reevaluationButtons, true);

  const categoryHints = {

    "価値観のずれ": "相手はどんな正しさや価値観を大事にしていると思いますか？",

    "不公平感": "相手（または評価者）はどんな基準でそう判断したと思いますか？",

    "侮辱・軽視": "相手はなぜ、その言葉や態度をとったと思いますか？どんな背景があったと思いますか？",

    "嫉妬・比較": "相手はなぜその結果を手にできたと思いますか？あなたはどうなりたいですか？",

    "自分への怒り": "その時の自分に、どんな言葉をかけてあげたいですか？",

    "心身の余裕のなさ": "最近、どんなストレスや疲れが溜まっていましたか？どうリラックスしますか？",

    "社会・正義への怒り": "どんな世の中になってほしいですか？近づくためにはどうしたらいいと思いますか？"

  };

  categorySelect.addEventListener("change", function () {

    const selected = this.value;

    if (selected && categoryHints[selected]) {

      categoryInput.style.display = "block";

      categoryHint.textContent = categoryHints[selected];

      document.querySelector('label[for="category-description"]').textContent = categoryHints[selected];

    } else {

      categoryInput.style.display = "none";

      categoryHint.textContent = "";

      document.querySelector('label[for="category-description"]').textContent = "";

    }

  });

  function renderRecords() {

    recordsDiv.innerHTML = "";

    recordList.forEach((record, index) => {

      const container = document.createElement("div");

      container.className = "record";

      container.style.borderLeft = record.reevaluation

        ? record.reevaluation > record.anger

          ? "5px solid red"

          : record.reevaluation === record.anger

          ? "5px solid yellow"

          : "5px solid #4caf50"

        : "5px solid #ccc";

      const summary = document.createElement("div");

      summary.className = "record-summary";

      summary.textContent = `${record.date}：怒り度${record.anger}`;

      summary.addEventListener("click", () => {

        detail.style.display = detail.style.display === "none" ? "block" : "none";

      });

      const detail = document.createElement("div");

      detail.className = "record-details";

      detail.innerHTML = `
<p><strong>怒りの分類:</strong> ${record.category}</p>
<p><strong>怒りの度合い:</strong> ${record.anger}</p>
<p><strong>出来事:</strong> ${record.event}</p>
<p><strong>分類後の記述:</strong> ${record.categoryDescription || ""}</p>
<p><strong>再評価:</strong> ${record.reevaluation || "未評価"}</p>

      `;

      const editBtn = document.createElement("button");

      editBtn.textContent = "編集";

      editBtn.className = "edit-btn";

      editBtn.addEventListener("click", () => {

        const newEvent = prompt("出来事を編集してください", record.event);

        if (newEvent !== null) record.event = newEvent;

        const newCatDesc = prompt("分類後の記述を編集してください", record.categoryDescription);

        if (newCatDesc !== null) record.categoryDescription = newCatDesc;

        const newReeval = prompt("再評価（1〜10）を入力してください", record.reevaluation);

        if (newReeval !== null && !isNaN(newReeval)) record.reevaluation = parseInt(newReeval);

        localStorage.setItem("angerRecords", JSON.stringify(recordList));

        renderRecords();

      });

      const deleteBtn = document.createElement("button");

      deleteBtn.textContent = "削除";

      deleteBtn.className = "delete-btn";

      deleteBtn.addEventListener("click", () => {

        if (confirm("この記録を削除しますか？")) {

          recordList.splice(index, 1);

          localStorage.setItem("angerRecords", JSON.stringify(recordList));

          renderRecords();

        }

      });

      detail.appendChild(editBtn);

      detail.appendChild(deleteBtn);

      container.appendChild(summary);

      container.appendChild(detail);

      recordsDiv.appendChild(container);

    });

  }

  recordBtn.addEventListener("click", () => {

    const anger = parseInt(document.getElementById("anger").value);

    const event = document.getElementById("event").value.trim();

    const category = categorySelect.value;

    const catDesc = document.getElementById("category-description").value.trim();

    const reevaluation = parseInt(document.getElementById("reevaluation").value);

    if (!anger || !event || !category || !catDesc) return alert("必須項目をすべて入力してください。");

    const now = new Date();

    const dateStr = `${now.getMonth() + 1}/${now.getDate()}`;

    recordList.unshift({

      anger,

      event,

      category,

      categoryDescription: catDesc,

      reevaluation,

      date: dateStr

    });

    localStorage.setItem("angerRecords", JSON.stringify(recordList));

    renderRecords();

    // 初期化

    document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));

    selectedAnger = selectedReeval = null;

    document.getElementById("anger").value = "";

    document.getElementById("event").value = "";

    document.getElementById("reevaluation").value = "";

    document.getElementById("category-description").value = "";

    categorySelect.value = "";

    categoryInput.style.display = "none";

    categoryHint.textContent = "";

    document.querySelector('label[for="category-description"]').textContent = "";

  });

  renderRecords();

  // モーダル表示（怒りとは）

  document.getElementById("open-info-modal").addEventListener("click", () => {

    document.getElementById("info-modal").style.display = "block";

  });

  document.getElementById("close-info-modal").addEventListener("click", () => {

    document.getElementById("info-modal").style.display = "none";

  });

  // モーダル表示（分類ヒント）

  document.getElementById("open-category-modal").addEventListener("click", () => {

    document.getElementById("category-modal").style.display = "block";

  });

  document.getElementById("close-category-modal").addEventListener("click", () => {

    document.getElementById("category-modal").style.display = "none";

  });

});
 