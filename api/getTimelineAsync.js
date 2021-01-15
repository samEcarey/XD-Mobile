export default async function getTimelineAsync(level, type) {
    setZoomlevel(level);
    let jobs;
    var data = JSON.stringify({
      starttime: startTime,
      endtime: endTime,
      zoomlevel: 1,
      requestType: type,
    });

    var config = {
      method: "put",
      url: "http://104.130.246.16:8080/timeline/get",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTIzNjk3MDIsImlhdCI6MTYwOTc3NzcwMiwidXNlcmlkIjoiN2VmMGM2MGMtZWNhOS00OGZhLWJjNDQtNjkxZDVmNTQwNDIyIn0.G1QaB_6lK_asw0jtHPgIHBaFws89zdZJnVJHWCeHzpiqZ3cLzvv-cIV3U2QOYEkOuej29djIOg-UTQ9Gua4-AneTkSV7Spq_FZ60k8i2Uqoc6SD1pc0WJqFRX8DcE-AtkdQawJdwHxjzeWYw6evSr3K7l2VpxKqdh6IT4t0dTB-GTGqBcOeyv0xeGt8SlbprtCXTVFUSrBNgxGF3IZ-n9NZeuA9hQKgFmY75T-owHtlm4AUIrd9-Sa9wdb69yK-0c8F9o4b9RhVwoYhSYQDJNmblu8WnaHHG3mVnTg1aIrOlGhGqiBEH1RjErsi5unaqjfd3oaiQDn4qW0mHqPZU1g",
        "Content-Type": "application/json",
      },
      data: data,
    };
    
    await axios(config)
      .then(function (response) {
       // console.log(JSON.stringify(response.data.payload))
        if (type === "future") {
          setFuture(response.data.payload);
        }
        if (type === "past") {
          setPast(response.data.payload);
        }
      })
      .catch(function (error) {
        return null;
      });

    //    console.log(jobs)
  }