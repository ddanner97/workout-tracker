import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";

export default function HomePage() {
  return (
    <div>
      <WorkoutForm />
      <hr />
      <WorkoutList />
    </div>
  );
}
