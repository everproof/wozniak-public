module Helpers
  def Helpers.parse_args(args)
    return args
      .scan(/("[^"]+"|[^\s"]+)/)
      .flatten
      .select { |arg| !(arg.nil? || arg.empty?) }
      .map { |arg| arg.gsub(/^"|"$/, "") }
  end
end
