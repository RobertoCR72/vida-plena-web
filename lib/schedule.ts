import type { DemoLecture } from "./demo-data";

function minutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function hasScheduleConflict(a: DemoLecture, b: DemoLecture) {
  return (
    a.date === b.date &&
    minutes(a.startTime) < minutes(b.endTime) &&
    minutes(a.endTime) > minutes(b.startTime)
  );
}

export function findConflicts(target: DemoLecture, lectures: DemoLecture[]) {
  return lectures.filter((lecture) => lecture.id !== target.id && hasScheduleConflict(target, lecture));
}

export function groupLecturesByDate(lectures: DemoLecture[]) {
  return lectures.reduce<Record<string, DemoLecture[]>>((groups, lecture) => {
    groups[lecture.date] = [...(groups[lecture.date] || []), lecture].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    return groups;
  }, {});
}
