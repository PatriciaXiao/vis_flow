

function submit_date(tmp_date){
  content = document.getElementById("show_date").value;
  form = document.getElementById("date_form");
  if(content.length==0) return;
  // console.log(tmp_date)
  year = tmp_date.year;
  month = tmp_date.month;
  day = tmp_date.day;
  // console.log(year, month, day)
  // console.log(content)
  selected_date_info = content.split("/");
  selected_year = parseInt(selected_date_info[2]);
  selected_month = parseInt(selected_date_info[0]);
  selected_day = parseInt(selected_date_info[1]);
  // console.log(selected_year, selected_month, selected_day)
  if(selected_year==year && selected_month==month && selected_day==day) return;
  form.submit()
}