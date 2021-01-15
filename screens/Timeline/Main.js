import _ from "lodash";
import React, { useEffect, useState, useRef, useReducer } from "react";
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

//import {calcOriginalTimeDiff} from '../../utilities/timelineZoomAlgorithim'

import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { set } from "react-native-reanimated";

var originalStart;
var originalEnd;
var originalTimeDiff;

var pinchLocationPercent;
var pinchTime;

var zoomPercent;

var newTimeDifference;
var newStartTime;
var newEndTime;

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
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
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
  const initialState = {
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    seven: [],
    eight: [],
  };

  function reducer(state, { type, level }) {
    switch (type) {
      case "addItem":
        console.log(state);
        return state;
      case "replace":
        return null;
      default:
        throw new Error();
    }
  }
  const [haveState, dispatchHave] = useReducer(reducer, initialState);

  const [startTime, setStartTime] = useState(
    dayjs().subtract(2, "year").startOf("year")
  );
  const [endTime, setEndTime] = useState(
    dayjs().add(2, "year").startOf("year")
  );

  const [zoomlevel, setZoomlevel] = useState(1);
  const [futureValidTime, setFutureValidTime] = useState(null);
  const [pastValidTime, setPastValidTime] = useState(null);
  const [availableValidTime, setAvailableValidTime] = useState(undefined);

  const [timelineData, setTimelineData] = useState([]);

  const [future, setFuture] = useState();
  const [past, setPast] = useState();

  const [ticks, setTicks] = useState(0);
  const [labels, setLabels] = useState();
  const [viewportData, setViewportData] = useState();

  const [detailScale, setDetailScale] = useState(1);
  const [details, setDetails] = useState();
  const [lastZoomScale, setLastZoomScale] = useState(4);
  const [timelineHeight, setTimelineHeight] = useState();

  const scaleAnimated = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log("------------");
    setTimelineData([]);
    calcOriginalTimeDiff(startTime, endTime);
  }, []);

  useEffect(() => {
    switch (zoomlevel) {
      case 2:
        break;
      case 3:
        break;
      default:
    }
    //console.log(Math.round(endTime.diff(startTime, "year", true)) + 1);
  }, [zoomlevel]);

  useEffect(() => {
    console.log(startTime, endTime);
    asyncTimelineAPICall(level, type, validtime)
  }, [startTime, endTime]);

  function calcOriginalTimeDiff(start, end) {
    originalStart = start;
    originalEnd = end;
    originalTimeDiff = originalEnd.diff(originalStart);
    return null;
  }
  function calcPinchLocationPercent(event) {
    if (timelineHeight !== undefined) {
      pinchLocationPercent = event.nativeEvent.focalY / timelineHeight;
      pinchTime = dayjs(
        pinchLocationPercent * originalTimeDiff + originalStart
      );
      zoomPercent = event.nativeEvent.scale * 0.05;
      newTimeDifference = originalTimeDiff * zoomPercent;
      newStartTime = pinchTime - pinchLocationPercent * newTimeDifference;
      newEndTime = newStartTime + newTimeDifference;
      setStartTime(dayjs(newStartTime))
      setEndTime(dayjs(newEndTime))
    }

    return null;
  }

  async function asyncTimelineAPICall(level, type, validtime) {
    setZoomlevel(level);
    let jobs;
    var data = JSON.stringify({
      starttime: startTime,
      endtime: endTime,
      zoomlevel: 1,
      requesttype: type,
      validtime: validtime,
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

    return await axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data.payload))
        return response;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  }

  const getPastAndFuture = () => {
    if (now.isSameOrBefore(startTime)) {
      //getFuture only
      //if (future === undefined) {}
      asyncTimelineAPICall(zoomlevel, "future", futureValidTime).then(
        (result) => {
          setFuture(result.data.payload);
          setFutureValidTime(dayjs());
        }
      );
    } else {
      //getPast & future
      asyncTimelineAPICall(zoomlevel, "future", futureValidTime).then(
        (result) => {
          setFuture(result.data.payload);
          setFutureValidTime(dayjs());
        }
      );
      asyncTimelineAPICall(zoomlevel, "past", pastValidTime).then((result) => {
        setPast(result.data.payload);
        setPastValidTime(dayjs());
      });
    }
  };

  const initYearLevel = () => {
    setTicks(4);

    getPastAndFuture();

    //   setTimeList({ ...timeList, one: [past, future] });

    setTimelineData((timelineData) => [
      ...timelineData,
      {
        title: "Main dishes",
        data: ["Pizza"],
        key: 1,
      },
    ]);
  };

  const splitBox = ({ item }) => {
    var displayedTicks = [];
    for (var i = 0; i < ticks; i++) {
      displayedTicks.push(<StyledTick />);
    }

    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <StyledTimelineBar>{displayedTicks}</StyledTimelineBar>
        {/*flatlist.item.content*/}
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
        "maximum amount of details. Just a whole lot of detail, officer, nothing to see here"
      );
    }
    if (detailScale > 9) {
      setDetailScale(9);
    }
    if (detailScale < 1) {
      setDetailScale(1);
    }
  }
  function calculatePinchBehavior() {
    ///console.log(detailScale);
    if (lastZoomScale < 0.5) {
      //console.log("zoom out");
      setDetailScale(detailScale - 1);
    }

    if (lastZoomScale > 0.3) {
      ///console.log("zoom in");
      setDetailScale(detailScale + 1);
    }
  }
  const onPinchGestureEvent = (event) => {
    //10 - 750

    setLastZoomScale(event.nativeEvent.scale);
    //console.log("event", event.nativeEvent.focalY);
    calculatePinchBehavior();
    calculateDetails();
  };
  const onZoomStateChange = (event) => {
    // console.log(pinchLocationPercent)
    {
      if (event.nativeEvent.state == State.BEGAN) {
      }
      if (event.nativeEvent.state == State.END) {
        calcPinchLocationPercent(event);
      }
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
    <PinchGestureHandler
      //enabled={false}
      style={{ height: "100%" }}
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={onZoomStateChange}
    >
      <StyledMain>
        {/* <Icon name="map-marker-alt" size={30} color="red" />*/}
        <Animated.View>
          <StyledTimeline
            onLayout={(event) => {
              var { height } = event.nativeEvent.layout;
              setTimelineHeight(height);
            }}
            sections={timelineData}
            style={styles.container}
            renderItem={splitBox}
            renderSectionHeader={renderTitle}
            keyExtractor={(item, index) => index}
          />
        </Animated.View>
      </StyledMain>
    </PinchGestureHandler>
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

const oldinit = () => {
  //setTimeList(...timeList.one, {one:[1,2]})
  //console.log(past)
  // console.log(future)

  //console.log(zoomlevel);
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

  pastItems.map((pastYear) => {
    //past.map()
    //console.log(past);
    //console.log(pastYear)
  });

  futureItems.map((futureYear) => {
    //past.map()
    //console.log(futureYear)
  });

  {
    /*if(past.length>0){
      past.map((item)=>{
        pastItems.includes(item.year) ? (console.log("yeah")):(console.log("no!"))
        //console.log(pastItems)
        //console.log(item.year)
      })
    }*/
  }

  if (future.length > 0) {
    future.map((item) => {
      //console.log(item.year)
    });
  }
  // console.log("PAST")
  //console.log(JSON.stringify(pastItems));
  //console.log("FUTURE")
  //console.log(JSON.stringify(futureItems))
};
export default Main;
/*past.map((obj) => {
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
                        icon: (
                          <Icon name="money-bill" size={15} color="black" />
                        ),
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
      });*/
