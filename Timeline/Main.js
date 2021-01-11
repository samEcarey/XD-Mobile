import _ from "lodash";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  SectionList,
  Dimensions,
} from "react-native";
import dayjs from "dayjs";
import Icon from "react-native-vector-icons/FontAwesome5";
import { BlurView } from "expo-blur";

import {
  StyledPill,
  StyledTimelineBar,
  StyledInvisibleItem,
  StyledMain,
  StyledPillBox,
  StyledTick,
  StyledTimeline,
} from "./Styles";
import axios from "axios";
import {
  FlatList,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
const renderItem = ({ item }) => {
  if (item.empty === true) {
    return <View style={[styles.item, styles.itemInvisible]} />;
  }
  return (
    <StyledPill
      theme={{
        main: pillTypes.filter((t) => {
          return t.type === item.type;
        })[0].color,
      }}
    >
      <View>{item.icon}</View>
      <Text>{item.title}</Text>
    </StyledPill>
  );
};
var quarterOfYear = require("dayjs/plugin/quarterOfYear");
dayjs.extend(quarterOfYear);
const numColumns = 4;
const pillTypes = [
  {
    type: 0,
    color: "#00e897",
  },
  {
    type: 1,
    color: "#00aeff",
  },
  {
    type: 2,
    color: "#ff4a59",
  },
  {
    type: 3,
    color: "#ffaa00",
  },
];

const Main = () => {
  const [now, setNow] = useState(dayjs());
  const [timeList, setTimeList] = useState({ one: [], two: [2, 4] });
  const [startTime, setStartTime] = useState(
    dayjs().subtract(2, "year").startOf("year")
  );
  const [endTime, setEndTime] = useState(
    dayjs().add(2, "year").startOf("year")
  );
  const [zoomlevel, setZoomlevel] = useState(1);
  const [future, setFuture] = useState();
  const [past, setPast] = useState();

  useEffect(() => {
    console.log("-----");
    // console.log(JSON.stringify(timeList));
  }, [timeList]);

  const [ticks, setTicks] = useState(0);
  const [labels, setLabels] = useState();
  const [viewportData, setViewportData] = useState();

  const [detailScale, setDetailScale] = useState(1);
  const [details, setDetails] = useState();
  const [lastZoomScale, setLastZoomScale] = useState(4);

  const scaleAnimated = useRef(new Animated.Value(1)).current;

  const initYearLevel = () => {
    //setTimeList(...timeList.one, {one:[1,2]})
    //console.log(past)
    // console.log(future)
    var pastItems = [];
    var futureItems = [];

    //console.log(zoomlevel);
    setTicks(4);
    setLastZoomScale(-1);
    var viewportData = [];
    for (
      var i = 0;
      i < Math.round(endTime.diff(startTime, "year", true)) + 1;
      i++
    ) {
      var date = dayjs(startTime.add(i, "years"));
      date.isBefore(dayjs(), "year")
        ? pastItems.push(date.year())
        : futureItems.push(date.year());

      //viewportYears.push({ date: dayjs(startTime.add(i, "years")) });
    }
    
    pastItems.map((pastYear)=>{
      //past.map()
      console.log(past)
      //console.log(pastYear)
    })

    futureItems.map((futureYear)=>{
      //past.map()
      //console.log(futureYear)
    })

    {/*if(past.length>0){
      past.map((item)=>{
        pastItems.includes(item.year) ? (console.log("yeah")):(console.log("no!"))
        //console.log(pastItems)
        //console.log(item.year)
      })
    }*/}

    if(future.length>0){
      future.map((item)=>{
        //console.log(item.year)
      })
    }
   // console.log("PAST")
    //console.log(JSON.stringify(pastItems));
    //console.log("FUTURE")
    //console.log(JSON.stringify(futureItems))

    
  };

  useEffect(() => {
    switch (zoomlevel) {
      case 2:
        console.log(zoomlevel);
        console.log(
          startTime.startOf("quarter").startOf("day").format("MM/DD/YYYY") +
            " - " +
            startTime.endOf("quarter").startOf("day").format("MM/DD/YYYY")
        );

        console.log(
          startTime
            .add(1, "quarter")
            .startOf("quarter")
            .startOf("day")
            .format("MM/DD/YYYY") +
            " - " +
            startTime
              .add(1, "quarter")
              .endOf("quarter")
              .startOf("day")
              .format("MM/DD/YYYY")
        );

        console.log(
          startTime
            .add(2, "quarter")
            .startOf("quarter")
            .startOf("day")
            .format("MM/DD/YYYY") +
            " - " +
            startTime
              .add(2, "quarter")
              .endOf("quarter")
              .startOf("day")
              .format("MM/DD/YYYY")
        );

        console.log(
          startTime
            .add(3, "quarter")
            .startOf("quarter")
            .startOf("day")
            .format("MM/DD/YYYY") +
            " - " +
            startTime
              .add(3, "quarter")
              .endOf("quarter")
              .startOf("day")
              .format("MM/DD/YYYY")
        );
        break;
      case 3:
        console.log(zoomlevel);
        break;
      default:
        //initYearLevel();
    }

    //console.log(Math.round(endTime.diff(startTime, "year", true)) + 1);
  }, [zoomlevel]);

  useEffect(() => {
    var data = JSON.stringify({
      starttime: startTime,
      endtime: endTime,
      zoomlevel: zoomlevel,
      requestType:"available",
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
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
       // setFuture(response.data.payload.jobs[0].future);
        //setPast(response.data.payload.jobs[0].past);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  var timelineData = [];

  if (past) {
    past.map((obj) => {
      timelineData.push({
        title: obj.label,
        data: [
          {
            content: (
              <StyledPillBox>
                <FlatList
                  scrollEnabled={false}
                  style={{ margin: "2%" }}
                  data={[
                    {
                      icon: <Icon name="money-bill" size={15} color="black" />,
                      title: " $" + obj.totalpay,
                      type: 0,
                    },
                    {
                      icon: (
                        <Icon
                          name="exclamation-triangle"
                          size={15}
                          color="black"
                        />
                      ),
                      title: " " + obj.unverifiedjobs,
                      type: 3,
                    },
                    {
                      icon: <Icon name="briefcase" size={15} color="black" />,
                      title: " " + obj.totaljobs,
                      type: 1,
                    },
                  ]}
                  renderItem={renderItem}
                  numColumns={numColumns}
                />
              </StyledPillBox>
            ),
          },
        ],
      });
      //console.log(obj.totaljobs);
    });
  }

  const splitBox = (flatlist) => {
    const getTimelineColor = () => {
      console.log(flatlist.section);
      var color;
      now.year() > flatlist.section.title
        ? (color = "orange")
        : (color = "skyblue");
      return color;
    };

    var displayedTicks = [];
    for (var i = 0; i < ticks; i++) {
      displayedTicks.push(<StyledTick />);
    }

    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <StyledTimelineBar size={{ main: 200 + lastZoomScale * 100 }}>
          {displayedTicks}
        </StyledTimelineBar>
        {flatlist.item.content}
      </View>
    );
  };
  function calculateDetails() {
    if (detailScale <= 3 && detailScale >= 0) {
      setDetails("few details");
    }
    if (detailScale >= 5 && detailScale <= 10) {
      setDetails("more details. More details");
    }
    if (detailScale >= 11 && detailScale <= 15) {
      setDetails(
        "maximum amount of details. Just a whole lot of detail here, officer, nothing to see here"
      );
    }
    if (detailScale > 18) {
      setDetailScale(15);
    }
    if (detailScale < 0) {
      setDetailScale(3);
    }
  }
  function calculatePinchBehavior() {
    console.log(detailScale);
    if (lastZoomScale < 1) {
      console.log("zoom out");
      setDetailScale(detailScale - 1);
    }

    if (lastZoomScale > 1) {
      console.log("zoom in");
      setDetailScale(detailScale + 1);
    }
  }
  const onPinchGestureEvent = (event) => {
    setLastZoomScale(event.nativeEvent.scale);
    console.log("event", event.nativeEvent.scale);
    calculatePinchBehavior();
    calculateDetails();
  };
  const onZoomStateChange = (event) => {
    if (event.nativeEvent.state == State.END) {
      console.log("------end------");
    }
  };
  const renderTitle = ({ section }) => {
    if (section.title !== null) {
      return (
        <BlurView
          intensity={100}
          tint={"dark"}
          style={{
            padding: "5%",
            blurRadius: "1",
            borderBottomColor: "white",
            borderBottomWidth: "1px",
            marginBottom: "10%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            {section.title}
          </Text>
        </BlurView>
      );
    }

    return null;
  };
  return (
    <StyledMain>
      {/* <Icon name="map-marker-alt" size={30} color="red" />*/}
      <PinchGestureHandler
        //enabled={false}
        style={{ height: "100%" }}
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onZoomStateChange}
      >
        <Animated.View>
          <StyledTimeline
            sections={timelineData}
            style={styles.container}
            renderItem={splitBox}
            renderSectionHeader={renderTitle}
            keyExtractor={(item, index) => index}
          />
        </Animated.View>
      </PinchGestureHandler>
    </StyledMain>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
  },

  itemInvisible: {
    backgroundColor: "transparent",
  },
});

export default Main;
