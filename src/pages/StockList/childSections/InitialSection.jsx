import TextArea from "../../../components/Textarea/Textarea";
import { Color } from "../../../constants/AppResource";

const InitialSection = ({
  handleInitialTextAreaInput,
  initialTextAreaInput,
  selectedTableData,
  setOpenNewBundle,
}) => {
  return (
    <div>
      <div>
        <p className="font-medium text-textColor" >
          {selectedTableData?.name}
        </p>
        <p className="text-sm  text-placeholderGray" >
          Closing Cost based Stocks
        </p>
      </div>
      <TextArea
        value={initialTextAreaInput}
        onChange={handleInitialTextAreaInput}
        minHeight="210px"
        placeholder={"Text Description of the Stock Bundle"}
        borderStyle="border-dotted"
      />
      <div className="flex justify-end mt-[7rem] ">
        <div
          className={`border pt-1.5 pb-1.5 pl-3 pr-3  rounded-lg  font-medium cursor-pointer text-switchBlueColor text-sm border-lightBlue`}
          
          onClick={()=>setOpenNewBundle(true)}
        >
          Evaluate
        </div>
      </div>
    </div>
  );
};

export default InitialSection;
