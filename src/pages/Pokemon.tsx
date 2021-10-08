import { useGetPokemonByNameQuery } from "../services/pokemon";
import { useDialog } from "../app/hooks";

export const Pokemon = ({
  name,
  pollingInterval,
}: {
  name: string;
  pollingInterval: number;
}) => {
  const { data, error, isLoading, isFetching } = useGetPokemonByNameQuery(
    name,
    { pollingInterval }
  );
  const { openDialog } = useDialog();

  // 비동기 이벤트 처리하는 법
  const handleSubmit = async (): Promise => {
    // 화면에 띄월 다이럴로그를 선언하고, 프로미스 결과를 기다린다.
    const hasConfirmed = await openDialog({
      title: "데이터 전송",
      contents: "입력한 데이터를 전송할까요?",
    });

    if (hasConfirmed) {
      // 이후 비즈니스 로직 실행...
    }
  };

  return (
    <>
      {error && <>Oh no, there was an error</>}
      {!error && isLoading && <>Loading...</>}
      {!error && !isLoading && data && (
        <>
          <h3>
            {data.species.name} {isFetching ? "..." : ""}
          </h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
          <button aria-label="Open dialog" onClick={handleSubmit}>
            다이얼로그
          </button>
        </>
      )}
    </>
  );
};
