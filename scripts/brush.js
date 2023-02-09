// Class for creating drawing tool

class Brush {
    // Constructors

    constructor(color, size, tool) {
        this.color = color;
        this.size = size;
        this.tool = tool;
    }

    // Getters and setters

    setColor(color) {
        this.color = color;
    }
    getColor() {
        return this.color;
    }
    setSize(size) {
        this.size = size;
    }
    getSize() {
        return this.size;
    }
    setTool(tool) {
        this.tool = tool;
    }
    getTool() {
        return this.tool;
    }
}

export default Brush