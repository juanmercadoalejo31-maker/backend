const { exec } = require("child_process");

const analizarGlucosa = async (req, res) => {

  const { glucosa } = req.body;

  const comando =
    `swipl -s prolog/diabetes.pl -g "evaluar_glucosa(${glucosa},X),write(X),halt."`;

  exec(comando, (error, stdout) => {

    if (error) {
      return res.status(500).json({
        mensaje: "Error Prolog"
      });
    }

    res.json({
      resultado: stdout.trim()
    });

  });

};

module.exports = {
  analizarGlucosa
};