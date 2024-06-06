body {
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: black;
    color: white;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

#header {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    top: 0;
}

#date-container {
    text-align: left;
}

#date, #day-name, #month-name {
    font-size: 24px;
    margin: 0;
    line-height: 1.2; /* Adjust line height to match text editor */
}

#editor {
    width: 80%;
    height: calc(100% - 40px); /* Adjust height to leave space for header */
    border: none;
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-y: auto;
    margin-top: 0; /* No additional margin-top */
    box-sizing: border-box;
    font-size: 26px; /* Slightly larger font size for editor text */
}
