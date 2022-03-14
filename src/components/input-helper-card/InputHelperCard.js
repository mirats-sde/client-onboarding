import "./InputHelperCard.css"

const InputHelperCard = ({ helperTitle, helperDesc, helperLogo }) => {
    return (
      <div className="input_helper_card">
        <div className="top">
            <img src={helperLogo} alt="#" className="helperCardImg"/>
            <p className="helper_title">
            {helperTitle}
            </p>
        </div>
        <p className="helper_desc">{helperDesc}</p>
      </div>
    );
};

export default InputHelperCard