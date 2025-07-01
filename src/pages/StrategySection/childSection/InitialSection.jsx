import TextArea from "../../../components/Textarea/Textarea";
import { Color } from "../../../constants/AppResource";

const InitialSection = ({
  handleInitialTextAreaInput,
  initialTextAreaInput,
  selectedTableData,
  setOpenNewStrategy,
}) => {
  return (
    <div>
      <div>
        <p className="font-medium text-textColor">
          {selectedTableData?.name}
        </p>
      </div>
      <TextArea
        value={initialTextAreaInput}
        onChange={handleInitialTextAreaInput}
        minHeight="210px"
        placeholder={"Text Description of the Strategy"}
        borderStyle="border-dotted"
      />
      <div className="flex justify-end mt-[7rem] ">
        <div
          className={`border pt-1.5 pb-1.5 pl-3 pr-3 text-switchBlueColor border-lightBlue text-sm  rounded-lg  font-medium cursor-pointer`}
          
          onClick={()=>setOpenNewStrategy(true)}
        >
          Evaluate
        </div>
      </div>
    </div>
  );
};

export default InitialSection;
