for item in json_array_unpack(<json>$data) union (
  insert StaticData {
    sheet := <str>item["sheet"],
    data := <str>item["data"],
  }
  unless conflict on .sheet
  else (
    update StaticData
    set {
      data := <str>item["data"],
    }
  )
)
